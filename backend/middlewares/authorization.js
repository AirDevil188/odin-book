const { config } = require("dotenv");
const { expressjwt: jwt } = require("express-jwt");
const { jwtDecode } = require("jwt-decode");

config();

const checkToken = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => {
    const token = req.cookies.token;
    console.log("getToken called for requireAuth. Cookie token value:", token); // Log actual token value
    return token;
  },
});

const requireAuth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.token,
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
  checkToken,
  checkAdmin,

  requireAuth,
};
