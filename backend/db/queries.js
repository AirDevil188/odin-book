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

const findUser = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

const createUser = async (email, password) => {
  try {
    return await prisma.user.create({
      data: {
        email: email,
        password: password,
      },
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};

// profile controller queries

const createProfile = async (firstName, lastName, avatar, userId) => {
  return await prisma.profile.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
      userId: userId,
    },
  });
};

const getProfiles = async (userId) => {
  try {
    return await prisma.profile.findUnique({
      where: {
        id: {
          not: userId,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = {
  findUser,
  createUser,
  getProfiles,
};
