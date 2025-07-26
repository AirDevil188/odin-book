const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const { verifyPassword, createHashedPassword } = require("../utils/utils");

const getProfile = async (req, res, next) => {
  const { id } = req.user;
  const profile = await db.getProfile(id);

  return res.status(200).json(profile);
};

const getProfiles = async (req, res, next) => {
  const { id } = req.user;
  const profiles = await db.getProfiles(id);
  return res.status(200).json({ profiles: profiles });
};

const deleteProfile = async (req, res, next) => {
  const { id } = req.user;
  const profile = await db.deleteProfile(id);
  return res
    .status(200)
    .json({ message: "Profile deleted successfully", profile });
};

const updateProfile = async (req, res, next) => {
  const { first_name, last_name, email, password, new_password } = req.body;
  const { id } = req.user;
  const user = await db.findUser(req.user.email);

  const match = await verifyPassword(password, user.password);

  if (match) {
    const hashedPassword = await createHashedPassword(new_password);
    try {
      const profile = await db.updateProfile(
        first_name,
        last_name,
        email,
        hashedPassword,
        id
      );
      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: "There was a problem with updating your account",
      });
    }
  }
  return res.status(403).json({
    message: "Wrong Password",
  });
};

module.exports = {
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
};
