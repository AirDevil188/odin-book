const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const getPosts = async (req, res, next) => {
  const { id } = req.user;
  try {
    const posts = await db.getFriendsPosts(id);
    return res.status(500).json({
      message: "Post fetched successfully",
      posts: posts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to fetch posts",
    });
  }
};

const createPost = async (req, res, next) => {
  const { id } = req.user;
  const { text } = req.body;
  try {
    const post = await db.createPost(text, id);
    res.status(200).json({
      message: "Post created successfully",
      post: post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "There was a problem with your request to create a post",
    });
  }
};

const updatePost = async (req, res, next) => {
  const { id } = req.user;
  const { postId } = req.params;
  const { text } = req.body;

  try {
    const post = await db.updatePost(text, postId, id);
    res.status(200).json({
      message: "Post updated successfully",
      post: post,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to edit the post",
    });
  }
};

const deletePost = async (req, res, next) => {
  const { id } = req.user;
  const { postId } = req.params;

  try {
    const post = await db.deletePost(postId, id);
    res.status(200).json({
      message: "Post deleted successfully",
      post: post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "There was a problem with your request to delete post",
    });
  }
};

const likePost = async (req, res, next) => {
  const { id } = req.user;
  const { postId } = req.params;

  try {
    const like = await db.likePost(postId, id);
    res.status(200).json({
      message: "Post liked successfully",
      post: like,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "There was a problem with your request to like a post",
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
