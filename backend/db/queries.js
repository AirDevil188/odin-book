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
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
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
    return err;
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
    return err;
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
    return err;
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
    return err;
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
    return err;
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
    return err;
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
    return err;
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
    return err;
  }
};

const acceptFriendRequest = async (accepterId, requesterId) => {
  console.log({ requester: requesterId, receiverId: accepterId });
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
    return err;
  }
};

module.exports = {
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
};
