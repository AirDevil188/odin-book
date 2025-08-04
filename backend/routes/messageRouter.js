const { Router } = require("express");

const messageRouter = Router();

const messageController = require("../controllers/messageController");
const { requireAuth } = require("../middlewares/authorization");

messageRouter.post("/new", requireAuth, messageController.createMessage);

messageRouter.put(
  "/:messageId/update",
  requireAuth,
  messageController.updateMessage
);

module.exports = messageRouter;
