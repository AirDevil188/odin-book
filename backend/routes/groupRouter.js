const { Router } = require("express");

const groupRouter = Router();

const groupController = require("../controllers/groupController");
const { requireAuth } = require("../middlewares/authorization");

groupRouter.get("/", requireAuth, groupController.getGroups);

groupRouter.get("/:groupId", requireAuth, groupController.getGroup);

groupRouter.put("/:groupId", requireAuth, groupController.addUsersToGroup);

module.exports = groupRouter;
