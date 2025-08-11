const db = require("../db/queries");

const getChats = async (req, res, next) => {
  const { id } = req.user;

  try {
    const chats = await db.getChats(id);
    return res.status(200).json({
      message: "Chats successfully fetched",
      chats: chats,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to fetch chats",
    });
  }
};

const getChat = async (req, res, next) => {
  const { id } = req.user;
  const { chatroomId } = req.params;

  try {
    const chat = await db.getChat(chatroomId, id);
    return res.status(200).json({
      message: "User chat fetched successfully",
      chat: chat,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to fetch user chat",
    });
  }
};

const deleteChat = async (req, res, next) => {
  const { id } = req.user;
  const { chatroomId } = req.params;

  try {
    const chat = await db.deleteChat(chatroomId, id);
    return res
      .status(200)
      .json({ message: "Message successfully deleted", chat: chat });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to delete user chat",
    });
  }
};

const createChat = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { text } = req.body;
    const { userId2 } = req.params;

    const chat = await db.createChat(id, userId2, text);
    return res.status(200).json({
      message: "Chat successfully created",
      chat: chat,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to create a new chat",
    });
  }
};

module.exports = {
  getChats,
  getChat,
  createChat,
  deleteChat,
};
