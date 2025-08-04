const db = require("../db/queries");

const createMessage = async (req, res, next) => {
  const { id } = req.user;

  const { text } = req.body;

  const { chatroomId, groupId } = req.body;

  try {
    const newMessage = await db.createMessage(text, chatroomId, groupId, id);

    return res.status(200).json({
      message: "Message created successfully",
      newMessage: newMessage,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to create a message.",
    });
  }
};

const updateMessage = async (req, res, next) => {
  const { id } = req.user;

  const { text } = req.body;

  const { messageId } = req.params;

  try {
    const updatedMessage = await db.updateMessage(text, messageId, id);

    return res.status(200).json({
      message: "Message updated successfully",
      updatedMessage: updatedMessage,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to update the message",
    });
  }
};

module.exports = {
  createMessage,
  updateMessage,
};
