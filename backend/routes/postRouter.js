const { Router } = require("express");
const { requireAuth } = require("../middlewares/authorization");

const postController = require("../controllers/postController");

const postRouter = Router();

postRouter.get("/", requireAuth, postController.getPosts);

postRouter.get("/:postId", requireAuth, postController.getPost);

postRouter.post("/new", requireAuth, postController.createPost);

postRouter.put("/:postId/update", requireAuth, postController.updatePost);

postRouter.delete("/:postId/delete", requireAuth, postController.deletePost);

postRouter.put("/:postId/like", requireAuth, postController.likePost);

module.exports = postRouter;
