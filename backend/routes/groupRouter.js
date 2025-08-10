const { Router } = require("express");

const groupRouter = Router();

const groupController = require("../controllers/groupController");
const { requireAuth } = require("../middlewares/authorization");

groupRouter.get("/", requireAuth, groupController.getGroups);

groupRouter.post("/add", requireAuth, groupController.createGroup);

groupRouter.delete("/:groupId", requireAuth, groupController.deleteGroup);

groupRouter.get("/:groupId", requireAuth, groupController.getGroup);

groupRouter.put("/:groupId/add", requireAuth, groupController.addUsersToGroup);

groupRouter.delete(
  "/:groupId/delete",
  requireAuth,
  groupController.deleteUsersFromGroup
);

module.exports = groupRouter;
