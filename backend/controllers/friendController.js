const db = require("../db/queries");

const getFriendRequests = async (req, res, next) => {
  const { id } = req.user;
  try {
    const friendRequests = await db.getFriendRequests(id);
    return res.status(200).json({
      message: "Friend requests fetched successfully",
      friendRequests: friendRequests,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      message: "There was a problem with fetching friend requests",
    });
  }
};

const createFriendRequest = async (req, res, next) => {
  const { id } = req.user;

  const { receiverId } = req.body;

  try {
    const friendRequest = await db.createFriendRequest(id, receiverId);
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

const deleteFriendRequest = async (req, res, next) => {
  const { id } = req.user;
  const { receiverId } = req.body;
  try {
    const friendRequest = await db.deleteFriendRequest(receiverId, id);
    res.status(200).json({
      message: "Friend request deleted successfully",
      friendRequest: friendRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "There was a problem with deletion of friend request",
    });
  }
};

const acceptFriendRequest = async (req, res, next) => {
  const { id } = req.user;
  const { requesterId } = req.body;

  try {
    const friendRequest = await db.acceptFriendRequest(id, requesterId);
    return res.status(200).json({
      message: "Friend request is accepted",
      friendRequest: friendRequest,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "There was a problem with accepting your friend request",
    });
  }
};

const deleteFriend = async (req, res, next) => {
  const { id } = req.user;
  const { friendId } = req.body;

  try {
    const friend = await db.deleteFriend(id, friendId);
    return res.status(200).json({
      message: "Friendship deleted successfully",
      friend: friend,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "There was a problem with deleting your friend request",
    });
  }
};

module.exports = {
  getFriendRequests,
  createFriendRequest,
  deleteFriendRequest,
  acceptFriendRequest,
  deleteFriend,
};
