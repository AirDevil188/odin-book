const { config } = require("dotenv");
const { expressjwt: jwt } = require("express-jwt");
const { jwtDecode } = require("jwt-decode");

config();

const requireAuth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }

    return null;
  },
  requestProperty: "user",
});

const checkAdmin = (req, res, next) => {
  const token = req.cookies.token;

  const decodedToken = jwtDecode(token);
  if (decodedToken.role !== "admin") {
    return res.status(401).json({
      message: "You are not authorized to access this page",
    });
  }
  next();
};

module.exports = {
  checkAdmin,
  requireAuth,
};
