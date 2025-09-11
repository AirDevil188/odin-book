const { jwtDecode } = require("jwt-decode");
const bcrypt = require("bcrypt");
const { config } = require("dotenv");
const jsonwebtoken = require("jsonwebtoken");
const randToken = require("rand-token");
const { addWeeks } = require("date-fns");

config();

const singToken = async (credentials) => {
  const payload = {
    id: credentials.id,
    email: credentials.email,
    role: credentials.role,
  };
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15min",
  });
};

const decodeToken = (token) => {
  return jwtDecode(token);
};

const verifyHash = async (value, hashedValue) => {
  return await bcrypt.compare(value, hashedValue);
};

const generateRawToken = () => {
  return randToken.uid(64);
};

const generateSelectorToken = () => {
  return randToken.uid(18);
};

const createHash = async (value) => {
  try {
    const hashedToken = await bcrypt.hash(value, 12);
    return hashedToken;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const newDateOneWeek = (currentDate) => {
  const oneWeekDate = addWeeks(currentDate, 1);

  return oneWeekDate;
};

module.exports = {
  decodeToken,
  createHash,
  verifyHash,
  singToken,
  generateRawToken,
  generateSelectorToken,
  newDateOneWeek,
};
