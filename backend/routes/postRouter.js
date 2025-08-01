const { Router } = require("express");
const { requireAuth } = require("../middlewares/authorization");

const postController = require("../controllers/postController");

const postRouter = Router();

postRouter.get("/", requireAuth, postController.getPosts);

postRouter.get("/:friendId/:postId", requireAuth, postController.getPost);

postRouter.post("/:userId/new", requireAuth, postController.createPost);

postRouter.put(
  "/:userId/:postId/update",
  requireAuth,
  postController.updatePost
);

postRouter.delete(
  "/:userId/:postId/delete",
  requireAuth,
  postController.deletePost
);

postRouter.put("/:userId/:postId/like", requireAuth, postController.likePost);

module.exports = postRouter;
