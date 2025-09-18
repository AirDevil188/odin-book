const { isValid } = require("date-fns/isValid");
const db = require("../db/queries");
const { requireAuth } = require("../middlewares/authorization");
const {
  singToken,
  newDateOneWeek,
  generateRawToken,
  decodeToken,
  createHash,
  verifyHash,
  generateSelectorToken,
} = require("../utils/utils");

const getRefreshToken = async (req, res, next) => {
  try {
    // get raw refresh cookie from req.headers.cookies
    const rawCookie = req.cookies.refreshToken;

    // check if the raw cookie is present and if it includes "selector" part of the token
    if (!rawCookie || !rawCookie.includes(".")) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    // destructure selector and raw cookie
    const [selector, rawToken] = rawCookie.split(".");

    // find the right refresh token in the DB by it's selector
    const refreshTokenRecord = await db.findRefreshTokenBySelector(selector);

    if (!refreshTokenRecord) {
      res.clearCookie("refreshToken");
      await db.invalidateRefreshToken(selector);

      return res.status(401).json({
        message: "Unauthorized: Invalid token selector",
      });
    }

    // compare hashed refresh token value with raw token
    const isValid = await verifyHash(rawToken, refreshTokenRecord.hashedToken);

    if (!isValid) {
      res.clearCookie("refreshToken");
      await db.invalidateRefreshToken(selector);

      return res.status(401).json({
        message: "Unauthorized: Invalid token",
      });
    }

    // compare refresh token user id to check if the user exists
    const user = await db.findUserById(refreshTokenRecord.userId);

    if (!user) {
      res.clearCookie("refreshToken");
      await db.invalidateRefreshToken(selector);

      return res.status(200).json({
        message: "Unauthorized: Invalid user",
      });
    }

    // generate new access token and userInfo
    const { password, ...rest } = user;
    const userInfo = rest;

    const newAccessToken = await singToken(userInfo);
    const decodedToken = decodeToken(newAccessToken);
    const newExpiresAt = decodedToken.exp;

    // TOKEN rotation
    const newRawToken = generateRawToken();
    const newHashedToken = await createHash(newRawToken);

    // update token with new hashed token and new expires at
    await db.updateRefreshToken(
      selector,
      newHashedToken,
      newDateOneWeek(new Date())
    );

    // set new refreshToken in the http-only cookie
    res.cookie("refreshToken", `${selector}.${newRawToken}`, {
      httpOnly: true,
      maxAge: 604800000, // one week
    });

    return res.status(200).json({
      message: "Token generated successfully",
      accessToken: newAccessToken,
      userInfo: userInfo,
      expiresAt: newExpiresAt,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const invalidateToken = async (req, res, next) => {
  try {
    // get the cookie
    const rawCookie = req.cookies.refreshToken;

    // split the cookie so that we can extract the selector
    const [selector, rawToken] = rawCookie.split(".");

    // delete the cookie from the cookie header
    res.clearCookie("refreshToken");
    // invalidate token by it's selector
    await db.invalidateRefreshToken(selector);

    res.status(200).json({ message: "Token successfully invalidated" });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getRefreshToken,
  invalidateToken,
};
