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

module.exports = {
  findUser,
  createUser,
  getProfile,
  getProfiles,
};
