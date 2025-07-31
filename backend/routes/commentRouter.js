const { Router } = require("express");

const commentRouter = Router();

const commentController = require("../controllers/commentController");
const { requireAuth } = require("../middlewares/authorization");

commentRouter.post(
  "/:userId/:postId/new",
  requireAuth,
  commentController.createComment
);

commentRouter.delete(
  "/:userId/:postId/:commentId/delete",
  requireAuth,
  commentController.deleteComment
);

commentRouter.put(
  "/:userId/:postId/:commentId/update",
  requireAuth,
  commentController.updateComment
);

commentRouter.put(
  "/:userId/:postId/:commentId/like",
  requireAuth,
  commentController.likeComment
);

module.exports = commentRouter;
