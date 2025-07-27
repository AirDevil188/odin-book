const { Router } = require("express");

const profileController = require("../controllers/profileController");
const friendController = require("../controllers/friendController");
const { requireAuth } = require("../middlewares/authorization");

const profileRouter = Router();

profileRouter.get("/", requireAuth, profileController.getProfiles);

profileRouter.get("/profile", requireAuth, profileController.getProfile);

profileRouter.put(
  "/profile/update",
  requireAuth,
  profileController.updateProfile
);

profileRouter.delete(
  "/profile/delete",
  requireAuth,
  profileController.deleteProfile
);

// friend routes

profileRouter.get(
  "/profile/friend-requests",
  requireAuth,
  friendController.getFriendRequests
);

profileRouter.post(
  "/profile/friend-requests/:receiverId/new",
  requireAuth,
  friendController.createFriendRequest
);

profileRouter.delete(
  "/profile/friend-requests/:receiverId/delete",
  requireAuth,
  friendController.deleteFriendRequest
);

profileRouter.post(
  "/profile/friend-requests/:receiverId/accept",
  requireAuth,
  friendController.acceptFriendRequest
);

module.exports = profileRouter;
