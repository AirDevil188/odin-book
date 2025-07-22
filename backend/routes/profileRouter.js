const { Router } = require("express");

const profileController = require("../controllers/profileController");
const { requireAuth } = require("../middlewares/authorization");

const profileRouter = Router();

profileRouter.get("/", profileController.getProfiles);

profileRouter.get("/profile", requireAuth, profileController.getProfile);

profileRouter.delete(
  "/profile/delete",
  requireAuth,
  profileController.deleteProfile
);

module.exports = profileRouter;
