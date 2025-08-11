const { Router } = require("express");

const chatRouter = Router();

const chatController = require("../controllers/chatController");
const { requireAuth } = require("../middlewares/authorization");

chatRouter.get("/", requireAuth, chatController.getChats);

chatRouter.get("/:chatroomId", requireAuth, chatController.getChat);

chatRouter.post("/:userId2", requireAuth, chatController.createChat);

chatRouter.put("/:chatroomId/delete", requireAuth, chatController.deleteChat);

module.exports = chatRouter;
