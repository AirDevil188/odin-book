const { config } = require("dotenv");
var { expressjwt: jwt } = require("express-jwt");
const { jwtDecode } = require("jwt-decode");

config();

const checkToken = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.token,
});

const attachUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Authorization invalid",
    });
  }

  const decodedToken = jwtDecode(token);
  req.user = decodedToken;

  next();
};

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
  attachUser,
};
