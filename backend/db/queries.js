const { PrismaClient } = require("@prisma/client");

const databaseUrl =
  process.env.NODE_ENV === "TEST"
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
  return await prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });
};

module.exports = {
  findUser,
  createUser,
};
