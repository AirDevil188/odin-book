const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const { config } = require("dotenv");

config();

const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await db.deleteUser(userId);
    return res.status(200).json({
      message: "User is deleted",
      user: user,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  deleteUser,
};
