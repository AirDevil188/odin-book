const express = require("express");
const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const { createHashedPassword } = require("../utils/utils");
config();

process.env.NODE_ENV = "TEST";

const db = require("../db/queries");

const app = express();
const userRouter = require("../routes/userRouter");
const profileRouter = require("../routes/profileRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/profiles", profileRouter);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

describe("Profile router functionality", () => {
  let authorizedUser;
  const testEmail = "tes@test.com";
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

  authorizedUser = request.agent(app);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should receive user profiles", async () => {
    await prisma.user.create({
      data: {
        email: "testing@email.com",
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Jack",
            lastName: "Sparrow",
          },
        },
      },
    });
    await authorizedUser
      .post("/log-in")
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    const res = await authorizedUser.get("/profiles").expect(200);

    expect(res.body.profiles[0]).toHaveProperty("id");
    expect(res.body.profiles[0]).toHaveProperty("firstName", "Jack");
    expect(res.body.profiles[0]).toHaveProperty("lastName", "Sparrow");
    expect(res.body.profiles[0]).toHaveProperty("userId");
    expect(res.body.profiles[0]).toHaveProperty("avatar");
  });

  it("should receive authorized user profile", async () => {
    await authorizedUser
      .post("/log-in")
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    const res = await authorizedUser.get("/profiles/profile").expect(200);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("firstName", "Test");
    expect(res.body).toHaveProperty("lastName", "Test");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("avatar");
  });
  it("should return Wrong Password for incorrect password input", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put("/profiles/profile/update")
      .send({
        password: "New1234!",
      })
      .expect(403);

    expect(res.body).toHaveProperty("message", "Wrong Password");
  });

  it("should update user profile with new data", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const newEmail = "new@email.com";
    const newPassword = "New1234!";

    const res = await authorizedUser
      .put("/profiles/profile/update")
      .send({
        email: newEmail,
        password: testPassword,
        new_password: newPassword,
        first_name: "John",
        last_name: "Shepard",
      })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Profile updated successfully");
    expect(res.body.profile).toHaveProperty("id");
    expect(res.body.profile).toHaveProperty("role", "user");
    expect(res.body.profile).toHaveProperty("email", "new@email.com");
  });

  it("should delete user profile", async () => {
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .delete("/profiles/profile/delete")
      .expect(200);

    expect(res.body).toHaveProperty("message", "Profile deleted successfully");
  });
});
