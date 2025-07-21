const { jwtDecode } = require("jwt-decode");
const bcrypt = require("bcrypt");
const { config } = require("dotenv");
const jsonwebtoken = require("jsonwebtoken");

config();

const singToken = async (credentials) => {
  const payload = {
    id: credentials.id,
    email: credentials.email,
    role: credentials.role,
  };
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
};

const decodeToken = (token) => {
  return jwtDecode(token);
};

const createHashedPassword = async (password) => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(hashedPassword);
    });
  });
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  decodeToken,
  createHashedPassword,
  verifyPassword,
  singToken,
};
