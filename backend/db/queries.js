const { PrismaClient } = require("@prisma/client");
const { config } = require("dotenv");

config();

const databaseUrl =
  process.env.NODE_ENV.toUpperCase() === "TEST"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

// refresh token

const generateRefreshToken = async (selector, token, userId, date) => {
  try {
    return await prisma.token.create({
      data: {
        selector: selector,
        hashedToken: token,
        userId: userId,
        expiresAt: date,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const findRefreshTokenBySelector = async (selector) => {
  try {
    return await prisma.token.findFirst({
      where: {
        selector: selector,
        expiresAt: { gte: new Date() },
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateRefreshToken = async (selector, newHashedToken, newExpiresAt) => {
  try {
    return await prisma.token.update({
      where: {
        selector: selector,
      },
      data: {
        hashedToken: newHashedToken,
        expiresAt: newExpiresAt,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const invalidateRefreshToken = async (selector) => {
  try {
    return await prisma.token.delete({
      where: {
        selector: selector,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// user controller queries

const findUser = async (email) => {
  try {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const findUserById = async (userId) => {
  try {
    return await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createUser = async (email, password, first_name, last_name, avatar) => {
  try {
    return await prisma.user.create({
      data: {
        email: email,
        password: password,
        profile: {
          create: {
            firstName: first_name,
            lastName: last_name,
            avatar: avatar,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// admin controller queries

const adminGetPosts = async () => {
  try {
    return prisma.post.findMany({
      include: {
        comments: {},
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const adminGetPost = async (postId, authorId) => {
  try {
    return prisma.post.findFirst({
      where: {
        id: postId,
        authorId: authorId,
      },
      include: {
        comments: {},
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const adminDeleteUser = async (userId) => {
  try {
    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const adminUpdateRole = async (userId, role) => {
  try {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const adminDeletePost = async (postId) => {
  try {
    return prisma.post.delete({
      where: {
        id: postId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const adminDeleteComment = async (commentId) => {
  try {
    return await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// profile controller queries

const getProfile = async (userId) => {
  try {
    return await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getProfiles = async (userId) => {
  try {
    return await prisma.profile.findMany({
      where: {
        NOT: {
          userId: userId,
        },
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteProfile = async (userId) => {
  try {
    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateProfile = async (
  first_name,
  last_name,
  email,
  password,
  userId
) => {
  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: email,
        password: password,
        profile: {
          update: {
            firstName: first_name,
            lastName: last_name,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// friends controller queries

const getFriendRequests = async (userId) => {
  try {
    return await prisma.friendRequests.findMany({
      where: {
        receiverId: userId,
        status: "pending",
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createFriendRequest = async (requesterId, receiverId) => {
  try {
    return await prisma.friendRequests.create({
      data: {
        receiverId: receiverId,
        requesterId: requesterId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteFriendRequest = async (receiverId, requesterId) => {
  try {
    return await prisma.friendRequests.delete({
      where: {
        requesterId_receiverId: {
          receiverId: receiverId,
          requesterId: requesterId,
        },
        status: "pending",
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const acceptFriendRequest = async (accepterId, requesterId) => {
  try {
    const [updatedFriendRequest, friendship1, friendship2] =
      await prisma.$transaction([
        prisma.friendRequests.update({
          where: {
            requesterId_receiverId: {
              requesterId: requesterId,
              receiverId: accepterId,
            },
            status: "pending",
          },
          data: {
            status: "accepted",
          },
        }),
        prisma.friendship.create({
          data: {
            userId: accepterId,
            friendId: requesterId,
          },
        }),
        prisma.friendship.create({
          data: {
            userId: requesterId,
            friendId: accepterId,
          },
        }),
      ]);
    return { updatedFriendRequest, friendship1, friendship2 };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteFriend = async (userId, friendId) => {
  try {
    const [friendship1, friendship2] = await prisma.$transaction([
      prisma.friendship.delete({
        where: {
          userId_friendId: {
            friendId: friendId,
            userId: userId,
          },
        },
      }),
      prisma.friendship.delete({
        where: {
          userId_friendId: {
            friendId: userId,
            userId: friendId,
          },
        },
      }),
    ]);
    return { friendship1, friendship2 };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// post controller queries

const getFriendsPosts = async (userId) => {
  try {
    return await prisma.post.findMany({
      where: {
        author: {
          is: {
            friendsOf: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
      include: {
        comments: {},
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getFriendPost = async (postId, userId) => {
  try {
    return await prisma.post.findFirst({
      where: {
        id: postId,
        author: {
          is: {
            friendsOf: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createPost = async (text, userId, images) => {
  images = [...new Set(images)];
  try {
    return await prisma.post.create({
      data: {
        text: text,
        authorId: userId,
        images: {
          create: images.map((imageUrl) => ({
            imageUrl: imageUrl,
            userId: userId,
          })),
        },
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updatePost = async (text, postId, userId) => {
  try {
    return await prisma.post.update({
      where: {
        id: postId,
        authorId: userId,
      },
      data: {
        text: text,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deletePost = async (postId, userId) => {
  try {
    return await prisma.post.delete({
      where: {
        id: postId,
        authorId: userId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const likePost = async (postId, userId) => {
  try {
    // search db for existing like
    const existingLike = await prisma.likedPosts.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });
    // if existing like is in the db, dislike the post
    if (existingLike) {
      return await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            decrement: 1,
          },
          likedBy: {
            delete: {
              userId_postId: {
                userId: userId,
                postId: postId,
              },
            },
          },
        },
      });
      // if the like is not found in the db, like the post
    } else {
      return await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            increment: 1,
          },
          likedBy: {
            create: {
              user: {
                connect: {
                  userId: userId,
                },
              },
            },
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// comment controller queries

const createComment = async (text, postId, userId) => {
  try {
    return await prisma.comment.create({
      data: {
        text: text,
        authorId: userId,
        postId: postId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateComment = async (text, commentId, userId) => {
  try {
    return await prisma.comment.update({
      where: {
        id: commentId,
        authorId: userId,
      },
      data: {
        text: text,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteComment = async (commentId, userId) => {
  try {
    return await prisma.comment.delete({
      where: {
        id: commentId,
        authorId: userId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const likeComment = async (commentId, userId) => {
  try {
    const existingLike = await prisma.likedComments.findUnique({
      where: {
        userId_commentId: {
          userId: userId,
          commentId: commentId,
        },
      },
    });
    if (existingLike) {
      return await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: {
            decrement: 1,
          },
          likedBy: {
            delete: {
              userId_commentId: {
                userId: userId,
                commentId: commentId,
              },
            },
          },
        },
        include: {
          likedBy: {},
        },
      });
    } else {
      return await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: {
            increment: 1,
          },
          likedBy: {
            create: {
              user: {
                connect: {
                  userId: userId,
                },
              },
            },
          },
        },
        include: {
          likedBy: {},
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// chatroom queries

const getChats = async (userId) => {
  try {
    return await prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        messages: {},
        users: {},
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getChat = async (chatroomId, userId) => {
  try {
    return await prisma.chat.findUnique({
      where: {
        id: chatroomId,
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        users: {},
        messages: {},
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createChat = async (userId1, userId2, text) => {
  const userIds = [userId1, userId2];

  try {
    // validate if there are two users
    if (userIds.length < 2) {
      throw Error("You must provide at least two users");
    }
    // try to find if chatroom exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                userId: userId1,
              },
            },
          },
          {
            users: {
              some: {
                userId: userId2,
              },
            },
          },
        ],
      },
      include: {
        users: {},
        messages: {},
      },
    });

    if (existingChat && existingChat.users.length === userIds.length) {
      // if chat already exists then create message for it
      const existingChatId = existingChat.id;
      const newMessage = await prisma.message.create({
        data: {
          text: text,
          chatroomId: existingChatId,
          userId: userId1,
        },
        include: {
          user: {},
          chats: {},
        },
      });
      existingChat.messages.push(newMessage);
      return existingChat;
    } else {
      // if chat doesn't exists create it and create new message
      return await prisma.chat.create({
        data: {
          messages: {
            create: {
              userId: userId1,
              text: text,
            },
          },

          users: {
            connect: userIds.map((id) => ({ userId: id })),
          },
        },
        include: {
          users: {},
          messages: {},
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteChat = async (chatRoomId, userId) => {
  try {
    return await prisma.chat.update({
      where: {
        id: chatRoomId,
      },
      data: {
        users: {
          disconnect: {
            userId: userId,
          },
        },
      },
      include: {
        users: {},
        messages: {},
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// messages controller queries

const createMessage = async (text, chatroomId, groupId, userId) => {
  let checkChatroom = null;
  let checkGroup = null;

  try {
    return await prisma.$transaction(async () => {
      if (chatroomId) {
        checkChatroom = await prisma.chat.findUnique({
          where: {
            id: chatroomId,
            users: {
              some: {
                userId: userId,
              },
            },
          },
        });
      } else {
        checkGroup = await prisma.group.findUnique({
          where: {
            id: groupId,
            users: {
              some: {
                userId: userId,
              },
            },
          },
        });
      }
      if (!checkGroup && !checkChatroom) {
        throw Error("No chatroom or group found");
      }
      return await prisma.message.create({
        data: {
          text: text,
          chatroomId: chatroomId,
          groupId: groupId,
          userId: userId,
        },
      });
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/// check arg
// search chat or group
// if matching create message
// if not error
const updateMessage = async (text, messageId, userId) => {
  try {
    return await prisma.message.update({
      where: {
        id: messageId,

        userId: userId,
      },
      data: {
        text: text,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// group controller queries

const getGroups = async (userId) => {
  try {
    return prisma.group.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        messages: {},
        users: {},
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getGroup = async (userId, groupId) => {
  try {
    return prisma.group.findUnique({
      where: {
        id: groupId,
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        users: {},
        messages: {},
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createGroup = async (userId, userIds, name, text) => {
  userIds = [...new Set(userIds)];

  try {
    // validate if there are at least two users
    if (userIds.length < 2) {
      throw Error("You must at least provide two users");
      // if there are only two users than chatroom will be created
    } else if (userIds.length === 2) {
      // check if the chat exists
      const existingChat = await prisma.chat.findFirst({
        where: {
          users: {
            every: {
              userId: {
                in: userIds,
              },
            },
          },
        },
        include: {
          messages: {},
          users: {},
        },
      });
      if (existingChat && existingChat.users.length === userIds.length) {
        // if the chat exists
        //  create new message for it
        const existingChatId = existingChat.id;

        await prisma.message.create({
          data: {
            text: text,
            chatroomId: existingChatId,
            user: {
              connect: {
                userId: userId,
              },
            },
          },
        });
        return existingChat;
      } else {
        // if chat doesn't exists create new one
        // create message
        await prisma.chat.create({
          data: {
            users: {
              connect: userIds.map((id) => ({ userId: id })),
            },
            messages: {
              create: {
                text: text,
                user: {
                  connect: {
                    userId: userId,
                  },
                },
              },
            },
          },
        });
      }
    } else if (userIds.length > 2) {
      // if there are more than two users then group will be created
      // create new message for it
      return await prisma.group.create({
        data: {
          name: name,
          users: {
            create: userIds.map((id) => ({
              userId: id,
              role: id === userId ? "admin" : "user",
            })),
          },
          messages: {
            create: {
              text: text,
              user: {
                connect: {
                  userId: userId,
                },
              },
            },
          },
        },
        include: {
          users: {},
          messages: {},
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const addUsersToGroup = async (userIds, groupId, userId) => {
  userIds = [...new Set(userIds)];

  try {
    return await prisma.$transaction(async () => {
      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
        include: {
          users: {
            where: {
              OR: [
                {
                  userId: userId,
                  role: "admin" || "moderator",
                },
                {
                  userId: {
                    in: userIds,
                  },
                },
              ],
            },
          },
        },
      });

      if (!group) {
        throw Error("Group not found");
      }

      // check if the loggedInUser is admin or moderator
      const authorizedUser = group.users.find(
        (user) => userId === user.userId && user.role !== "user"
      );

      if (!authorizedUser) {
        throw Error("User is not authorized to make this request");
      }

      // check if the user is in the group
      const existingUser = group.users.find((user) =>
        userIds.includes(user.userId)
      );

      if (existingUser) {
        throw Error("User already exists");
      } else {
        // add new user/users
        return await prisma.group.update({
          where: {
            id: groupId,
          },
          data: {
            users: {
              create: userIds.map((id) => ({
                userId: id,
              })),
            },
          },
          include: {
            messages: {},
            users: {},
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteUsersFromGroup = async (userIds, groupId, userId) => {
  userIds = [...new Set(userIds)];

  try {
    return await prisma.$transaction(async () => {
      // look if the group exists
      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
        include: {
          users: {
            where: {
              OR: [
                {
                  role: "admin" || "moderator",
                },
                {
                  userId: {
                    in: userIds,
                  },
                },
              ],
            },
          },
        },
      });
      if (!group) {
        throw Error("Group not found");
      }

      // check if loggedInUser is moderator or admin
      const authorizedUser = group.users.find(
        (user) => userId === user.userId && user.role !== "user"
      );

      if (!authorizedUser) {
        throw Error("User is not authorized to make this request");
      }

      return await prisma.groupMembers.deleteMany({
        where: {
          userId: { in: userIds },
          groupId: groupId,
        },
      });
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteGroup = async (userId, groupId) => {
  try {
    return await prisma.groupMembers.delete({
      where: {
        userId_groupId: {
          userId: userId,
          groupId: groupId,
        },
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  findRefreshTokenBySelector,
  generateRefreshToken,
  updateRefreshToken,
  invalidateRefreshToken,
  adminGetPosts,
  adminGetPost,
  adminDeleteUser,
  adminUpdateRole,
  adminDeletePost,
  adminDeleteComment,
  findUser,
  findUserById,
  createUser,
  getProfile,
  getProfiles,
  deleteProfile,
  updateProfile,
  getFriendRequests,
  createFriendRequest,
  deleteFriendRequest,
  acceptFriendRequest,
  deleteFriend,
  getFriendPost,
  getFriendsPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  getChats,
  getChat,
  createChat,
  deleteChat,
  createMessage,
  updateMessage,
  getGroups,
  getGroup,
  createGroup,
  addUsersToGroup,
  deleteUsersFromGroup,
  deleteGroup,
};
