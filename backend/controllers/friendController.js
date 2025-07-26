const db = require("../db/queries");

const createFriendRequest = async (req, res, next) => {
  const { id } = req.user;
  const { receiverId } = req.body;
  try {
    const friendRequest = await db.createFriendRequest(receiverId, id);
    res.status(200).json({
      message: "Friend request created successfully",
      friendRequest: friendRequest,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "There was a problem with creation of friend request",
    });
  }
};

module.exports = {
  createFriendRequest,
  deleteFriendRequest,
};
