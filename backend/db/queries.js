const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
