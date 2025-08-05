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
  const testEmail = "test@test.com";
  const secondTestEmail = "test@email.com";
  const testPassword = "Test1234!";

  let hashedPassword;
  let authorizedUser;
  let user1;
  let user2;
  let user1Id;
  let user2Id;
  let userIds;
  let chat;
  let chatroomId;
  let groupId;

  beforeAll(async () => {
    hashedPassword = await createHashedPassword(testPassword);
  });

  beforeEach(async () => {
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.chat.deleteMany({});

    user1 = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Test",
          },
        },
      },
    });
    user2 = await prisma.user.create({
      data: {
        email: secondTestEmail,
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test 2",
            lastName: "Test 2",
          },
        },
      },
    });

    user1Id = user1.id;
    user2Id = user2.id;
    userIds = [user1Id, user2Id];

    chat = await prisma.chat.create({
      data: {
        users: {
          connect: userIds.map((id) => ({ userId: id })),
        },
        messages: {
          create: {
            text: "Test message",
            userId: user1Id,
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
        email: testEmail,
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
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .get(`/profiles/chats/${chatroomId}`)
      .expect(200);

    console.error(res.body);

    expect(res.body).toHaveProperty(
      "message",
      "User chat fetched successfully"
    );

    expect(res.body.chat).toHaveProperty("id", chatroomId);
    expect(res.body.chat).toHaveProperty("users");
    expect(res.body.chat).toHaveProperty("messages");
  });
});
