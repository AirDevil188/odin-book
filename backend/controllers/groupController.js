const db = require("../db/queries");

const getGroups = async (req, res, next) => {
  const { id } = req.user;

  try {
    const groups = await db.getGroups(id);
    return res.status(200).json({
      message: "Groups fetched successfully",
      groups: groups,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to fetch user groups",
    });
  }
};

const getGroup = async (req, res, next) => {
  const { id } = req.user;
  const { groupId } = req.params;

  try {
    const group = await db.getGroup(id, groupId);
    return res.status(200).json({
      message: "Group fetched successfully",
      group: group,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to fetch user group",
    });
  }
};

const addUserToGroup = async (req, res, next) => {
  const { id } = req.user;
  const { userIds } = req.body;
  const { groupId } = req.params;

  try {
    const group = await db.addUsersToGroup(userIds, groupId, id);
    return res.status(200).json({
      message: "User successfully added to the group",
      group: group,
    });
  } catch (err) {
    return res.status(500).json({
      message: "There was a problem with your request to add user to the group",
    });
  }
};

const deleteGroup = async (req, res, next) => {
  const { id } = req.user;
  const { groupId } = req.params;
  const { deleteUserId } = req.body;

  try {
    const group = await db.deleteGroup(id, groupId, deleteUserId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was a problem with your request to delete the group",
    });
  }
};

module.exports = {
  getGroups,
  getGroup,
  addUserToGroup,
  deleteGroup,
};
