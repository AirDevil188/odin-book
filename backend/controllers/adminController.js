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
    return res.status(500).json({
      message: "There was a problem with your request to delete the user",
    });
  }
};

const updateRole = async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const user = await db.updateRole(userId, role);
    return res.status(200).json({
      message: "User role updated successfully",
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to update user role",
    });
  }
};

module.exports = {
  deleteUser,
  updateRole,
};
