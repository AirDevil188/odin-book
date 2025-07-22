const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const getProfile = async (req, res, next) => {
  const { id } = req.user;
  const profile = await db.getProfile(id);

  return res.status(200).json(profile);
};

const getProfiles = async (req, res, next) => {
  const { id } = req.user;
  const profiles = await db.getProfiles(id);
  return res.status(200).json(profiles);
};

const deleteProfile = async (req, res, next) => {
  const { id } = req.user;
  const profile = await db.deleteProfile(id);
  return res.status(200).json(profile);
};

const updateProfile = async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;
  const { id } = req.user;
  const profile = await db.updateProfile(
    first_name,
    last_name,
    email,
    password,
    id
  );
  return res.status(200).json(profile);
};

module.exports = {
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
};
