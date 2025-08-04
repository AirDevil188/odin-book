const express = require("express");
const request = require("supertest");
const { config } = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const cookieParser = require("cookie-parser");
const { createHashedPassword } = require("../utils/utils");

config();

const userRouter = require("../routes/userRouter");
const profileRouter = require("../routes/profileRouter");
const postRouter = require("../routes/postRouter");
const messageRouter = require("../routes/messageRouter");

process.env.NODE_ENV = "TEST";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", userRouter);
app.use("/profiles", profileRouter);
app.use("/profiles/posts", postRouter);
app.use("/profiles/messages", messageRouter);

describe("Test message router functionality", () => {
  let authorizedUser;
  let hashedPassword;
  let user1;
  let user2;
  let user1Id;
  let user2Id;
  let userIds;
  let chat;
  let chatroomId;
  let groupId;

  const testEmail = "test@test.com";
  const secondTestEmail = "test@email.com";
  const testPassword = "Test1234!";

  beforeAll(async () => {
    hashedPassword = await createHashedPassword(testPassword);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.post.deleteMany({});
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
      },
    });

    chatroomId = chat.id;
  });

  authorizedUser = request.agent(app);

  it("should create new message in the chatroom", async () => {
    groupId = null;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .post("/profiles/messages/new")
      .send({
        text: "Test chat",
        chatroomId: chatroomId,
        groupId: groupId,
      })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Message created successfully");
    expect(res.body.newMessage).toHaveProperty("id");
    expect(res.body.newMessage).toHaveProperty("text", "Test chat");
    expect(res.body.newMessage).toHaveProperty("userId", user1Id);

    expect(res.body.newMessage).toHaveProperty("chatroomId", chatroomId);
    expect(res.body.newMessage).toHaveProperty("groupId", null);
  });

  it("should update message in the chatroom", async () => {
    const message = await prisma.message.create({
      data: {
        text: "Test Message",
        userId: user1Id,
        chatroomId: chatroomId,
      },
    });
    groupId = null;
    const messagesId = message.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put(`/profiles/messages/${messagesId}/update`)
      .send({
        text: "Updated message text",
      });

    expect(res.body).toHaveProperty("message", "Message updated successfully");
    expect(res.body.updatedMessage).toHaveProperty("id");
    expect(res.body.updatedMessage).toHaveProperty(
      "text",
      "Updated message text"
    );
  });
});
