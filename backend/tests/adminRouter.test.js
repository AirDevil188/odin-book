const express = require("express");
const request = require("supertest");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");

config();

process.env.NODE_ENV = "TEST";

const app = express();

const userRouter = require("../routes/userRouter");
const adminRouter = require("../routes/adminRouter");
const profileRouter = require("../routes/profileRouter");
const { createHashedPassword } = require("../utils/utils");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/profiles", profileRouter);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

describe("Admin router functionality", () => {
  let authorizedUser;
  const testEmail = "test@admin.com";
  const testPassword = "Test1234!";
  let hashedPassword;

  beforeAll(async () => {
    hashedPassword = await createHashedPassword(testPassword);
  });

  beforeEach(async () => {
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        role: "admin",
        profile: {
          create: {
            firstName: "Test",
            lastName: "Test",
            avatar: null,
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  authorizedUser = request.agent(app);

  it("Log ins as admin", async () => {
    const res = await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Authentication successful");
    expect(res.header).toHaveProperty("set-cookie");
    expect(res.body.userInfo).toHaveProperty("role", "admin");
  });

  it("it doesn't allow deletion of the user, if the logged in user is not admin", async () => {
    const testingUser1 = await prisma.user.create({
      data: {
        email: "test@test.com",
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Test",
          },
        },
      },
    });
    const userId = testingUser1.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: "test@test.com",
        password: "Test1234!",
      })
      .expect(200);

    const res = await authorizedUser
      .delete(`/admin/${userId}/delete`)
      .expect(401);

    expect(res.body).toHaveProperty(
      "message",
      "You are not authorized to access this page"
    );
  });

  it("Deletes the user", async () => {
    const testingUser1 = await prisma.user.create({
      data: {
        email: "test@test.com",
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Test",
          },
        },
      },
    });
    const userId = testingUser1.id;

    await authorizedUser
      .post("/log-in")
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    const res = await authorizedUser
      .delete(`/admin/${userId}/delete`)
      .expect(200);

    expect(res.body).toHaveProperty("message", "User is deleted");
    expect(res.body.user).toHaveProperty("id", userId);
    expect(res.body.user).toHaveProperty("email", "test@test.com");
  });

  it("checks if the user role is updated", async () => {
    const testingUser1 = await prisma.user.create({
      data: {
        email: "test@test.com",
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Test",
          },
        },
      },
    });
    const userId = testingUser1.id;
    const role = "admin";

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put(`/admin/${userId}/role/update`)
      .send({
        role: role,
      })
      .expect(200);

    expect(res.body).toHaveProperty(
      "message",
      "User role updated successfully"
    );
    expect(res.body.user).toHaveProperty("id", userId);
    expect(res.body.user).toHaveProperty("email", "test@test.com");
    expect(res.body.user).toHaveProperty("role", "admin");
  });
});
