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

module.exports = adminRouter;
