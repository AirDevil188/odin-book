const express = require("express");
const request = require("supertest");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const { createHashedPassword } = require("../utils/utils");

process.env.NODE_ENV = "TEST";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

config();

const app = express();

const userRouter = require("../routes/userRouter");
const chatRouter = require("../routes/chatRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/profiles/chats", chatRouter);

describe("Test Chat Router functionality", () => {
  const testEmails = ["test@test.com", "test2@test.com", "test3@test.com"];
  const testPassword = "Test1234!";

  let hashedPassword;
  let authorizedUser;
  let chat;
  let chatroomId;

  beforeAll(async () => {
    hashedPassword = await createHashedPassword(testPassword);
  });

  beforeEach(async () => {
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.chat.deleteMany({});

    const userPromise = Array.from({ length: 2 }).map(async (_, i) => {
      const user = await prisma.user.create({
        data: {
          email: testEmails[i],
          password: hashedPassword,
          profile: {
            create: {
              firstName: "Test",
              lastName: "Test",
            },
          },
        },
      });
      return user;
    });

    const users = await Promise.all(userPromise);
    const userIds = users.map((user) => user.id);

    chat = await prisma.chat.create({
      data: {
        users: {
          connect: userIds.map((id) => ({ userId: id })),
        },
        messages: {
          create: {
            text: "Test message",
            userId: userIds[0],
          },
        },
      },
    });

    chatroomId = chat.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  authorizedUser = request.agent(app);

  it("gets user chats", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[0],
        password: "Test1234!",
      })
      .expect(200);

    const res = await authorizedUser.get("/profiles/chats").expect(200);

    expect(res.body).toHaveProperty("message", "Chats successfully fetched");
    expect(res.body.chats[0]).toHaveProperty("id");
    expect(res.body.chats[0].messages[0]).toHaveProperty(
      "text",
      "Test message"
    );
  });

  it("gets specific user chat", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[0],
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .get(`/profiles/chats/${chatroomId}`)
      .expect(200);

    expect(res.body).toHaveProperty(
      "message",
      "User chat fetched successfully"
    );

    expect(res.body.chat).toHaveProperty("id", chatroomId);
    expect(res.body.chat).toHaveProperty("users");
    expect(res.body.chat).toHaveProperty("messages");
  });
});
