const { Router } = require("express");

const commentRouter = Router();

const commentController = require("../controllers/commentController");
const { requireAuth } = require("../middlewares/authorization");

commentRouter.post(
  "/:postId/new",
  requireAuth,
  commentController.createComment
);

commentRouter.delete(
  "/:commentId/delete",
  requireAuth,
  commentController.deleteComment
);

commentRouter.put(
  "/:commentId/update",
  requireAuth,
  commentController.updateComment
);

commentRouter.put(
  "/:commentId/like",
  requireAuth,
  commentController.likeComment
);

module.exports = commentRouter;
