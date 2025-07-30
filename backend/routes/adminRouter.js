const { Router } = require("express");
const { checkAdmin, requireAuth } = require("../middlewares/authorization");

const adminRouter = Router();

const adminController = require("../controllers/adminController");

adminRouter.delete(
  "/:userId/delete",
  requireAuth,
  checkAdmin,
  adminController.deleteUser
);

adminRouter.delete(
  "/:userId/:postId/post/delete",
  requireAuth,
  checkAdmin,
  adminController.deletePost
);

adminRouter.put(
  "/:userId/role/update",
  requireAuth,
  checkAdmin,
  adminController.updateRole
);

module.exports = adminRouter;
