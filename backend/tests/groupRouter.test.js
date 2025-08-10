const express = require("express");
const request = require("supertest");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const { createHashedPassword } = require("../utils/utils");

config();

const groupRouter = require("../routes/groupRouter");
const profileRouter = require("../routes/profileRouter");
const userRouter = require("../routes/userRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/profiles", profileRouter);
app.use("/profiles/groups", groupRouter);

process.env.NODE_ENV = "TEST";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

describe("Test Group Router functionality", () => {
  const testEmails = ["test@test.com", "test2@test.com", "test3@test.com"];
  const testPassword = "Test1234!";

  let hashedPassword;
  let authorizedUser;
  let users;
  let newGroupTestingUserId;

  let userIds = [];
  let groupIds = [];

  beforeAll(async () => {
    hashedPassword = await createHashedPassword(testPassword);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.groupMembers.deleteMany({});
    await prisma.group.deleteMany({});

    const userPromise = Array.from({ length: 3 }).map(async (_, i) => {
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

    users = await Promise.all(userPromise);
    userIds = users.map((user) => user.id);

    const groupPromise = Array.from({ length: 2 }).map(async (_, i) => {
      const group = await prisma.group.create({
        data: {
          name: "Test Group",
          users: {
            create: userIds.map((id) => ({
              userId: id,
              role: userIds[1] == id ? "admin" : "user",
            })),
          },
          messages: {
            create: {
              text: "First test group message",
              userId: userIds[0],
            },
          },
        },
        include: {
          users: {},
        },
      });
      return group;
    });
    const groups = await Promise.all(groupPromise);
    groupIds = groups.map((group) => group.id);

    const newGroupTestingUser = await prisma.user.create({
      data: {
        email: "new@user.com",
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Test",
          },
        },
      },
    });
    newGroupTestingUserId = newGroupTestingUser.id;
  });

  authorizedUser = request.agent(app);

  it("should fetch all user groups", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[0],
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser.get("/profiles/groups").expect(200);

    expect(res.body).toHaveProperty("message", "Groups fetched successfully");
    expect(res.body.groups).toHaveLength(2);
    expect(res.body.groups[0]).toHaveProperty("id");
    expect(res.body.groups[0]).toHaveProperty("name", "Test Group");
    expect(res.body.groups[0]).toHaveProperty("messages");
    expect(res.body.groups[0]).toHaveProperty("users");
  });

  it("should fetch specific user group", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[0],
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .get(`/profiles/groups/${groupIds[0]}`)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Group fetched successfully");
    expect(res.body.group).toHaveProperty("id", groupIds[0]);
    expect(res.body.group).toHaveProperty("messages");
    expect(res.body.group).toHaveProperty("users");
  });

  it("should create new group", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[1],
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .post("/profiles/groups/add")
      .send({
        name: "Test Group",
        userIds: userIds,
        text: "First Group message",
      })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Group successfully created");
    expect(res.body.group).toHaveProperty("id");
    expect(res.body.group).toHaveProperty("users");
    expect(res.body.group.users).toHaveLength(3);
  });

  it("should add users to group", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[1],
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put(`/profiles/groups/${groupIds[0]}/add`)
      .send({
        userIds: [newGroupTestingUserId],
      })
      .expect(200);

    expect(res.body).toHaveProperty(
      "message",
      "User successfully added to the group"
    );
  });

  it("should not allow users that are not admin to add new users to the group", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[0],
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put(`/profiles/groups/${groupIds[0]}/add`)
      .send({
        userIds: [newGroupTestingUserId],
      })
      .expect(500);

    expect(res.body).toHaveProperty(
      "message",
      "There was a problem with your request to add user to the group"
    );
  });

  it("should let admins of the group to remove the user from the group", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[1],
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .delete(`/profiles/groups/${groupIds[0]}/delete`)
      .send({
        userIds: [userIds[0]],
      });

    expect(res.body).toHaveProperty(
      "message",
      "User successfully deleted from the group"
    );

    expect(res.body.group).toHaveProperty("count", 1);
  });

  it("should not allow users that are not admin to delete  users from the group", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmails[0],
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .delete(`/profiles/groups/${groupIds[0]}/delete`)
      .send({
        userIds: [userIds[1]],
      })
      .expect(500);

    expect(res.body).toHaveProperty(
      "message",
      "There was a problem with your request to remove user from the group"
    );
  });
});
