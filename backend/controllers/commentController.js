const db = require("../db/queries");

const createComment = async (req, res, next) => {
  const { id } = req.user;

  const { text } = req.body;

  const { postId } = req.params;

  try {
    const comment = await db.createComment(text, postId, id);
    res.status(200).json({
      message: "Comment created successfully",
      comment: comment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to create a new comment",
    });
  }
};

const updateComment = async (req, res, next) => {
  const { id } = req.user;

  const { text } = req.body;

  const { commentId } = req.params;

  try {
    const comment = await db.updateComment(text, commentId, id);
    return res.status(200).json({
      message: "Comment updated successfully",
      comment: comment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to update a comment",
    });
  }
};

const deleteComment = async (req, res, next) => {
  const { id } = req.user;

  const { commentId } = req.params;

  try {
    const comment = await db.deleteComment(commentId, id);
    return res.status(200).json({
      message: "Comment deleted successfully",
      comment: comment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to delete a comment",
    });
  }
};

const likeComment = async (req, res, next) => {
  const { id } = req.user;

  const { commentId } = req.params;

  try {
    const like = await db.likeComment(commentId, id);
    return res.status(200).json({
      message: "Comment liked successfully",
      comment: like,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to like a comment",
    });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
};
