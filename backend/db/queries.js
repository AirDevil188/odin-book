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

const createPost = async (text, userId) => {
  try {
    return await prisma.post.create({
      data: {
        text: text,
        authorId: userId,
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

const likeComment = async (postId, commentId, userId) => {
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
          authorId: userId,
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
      });
    } else {
      return await prisma.comment.update({
        where: {
          authorId: userId,
          postId: postId,
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
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  adminDeleteUser,
  adminUpdateRole,
  adminDeletePost,
  adminDeleteComment,
  findUser,
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
  createPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
};
