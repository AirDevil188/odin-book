const express = require("express");
const request = require("supertest");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const { createHashedPassword } = require("../utils/utils");

config();

process.env.NODE_ENV = "TEST";

const userRouter = require("../routes/userRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

describe("Test User router functionality", () => {
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  authorizedUser = request.agent(app);

  it("should check if all sign up form fields are required", async () => {
    const res = await authorizedUser
      .post("/sign-up")
      .send({
        email: testEmail,
      })
      .expect(422);

    expect(res.body.errors[0]).toHaveProperty(
      "msg",
      "Password must be at least 8 characters long. And it must contain at least one lowercase letter, one uppercase one symbol and one number."
    );
  });

  it("should check if confirm password and password fields are the same", async () => {
    const res = await authorizedUser
      .post("/sign-up")
      .send({
        email: testEmail,
        password: testPassword,
        confirm_password: "Test1235!",
      })
      .expect(422);

    expect(res.body.errors[0]).toHaveProperty("msg", "Passwords must match.");
  });

  it("should check if the password requirement is met", async () => {
    const res = await authorizedUser
      .post("/sign-up")
      .send({
        email: testEmail,
        password: "test",
        confirm_password: "test",
      })
      .expect(422);

    expect(res.body.errors[0]).toHaveProperty(
      "msg",
      "Password must be at least 8 characters long. And it must contain at least one lowercase letter, one uppercase one symbol and one number."
    );
  });

  it("should check if the provided email is of the email type", async () => {
    const res = await authorizedUser
      .post("/sign-up")
      .send({
        email: "test",
        password: testPassword,
        confirm_password: testPassword,
      })
      .expect(422);

    expect(res.body.errors[0]).toHaveProperty("msg", "Invalid email address.");
  });

  it("should sign up new user", async () => {
    const res = await authorizedUser
      .post("/sign-up")
      .send({
        email: testEmail,
        password: testPassword,
        confirm_password: testPassword,
        first_name: "Test",
        last_name: "Test",
      })
      .expect(200);

    expect(res.body).toHaveProperty("message", "User Created!");
    expect(res.body.userInfo).toHaveProperty("email", "tes@test.com");
    expect(res.body.userInfo).toHaveProperty("role", "user");
    expect(res.body.userInfo).toHaveProperty("first_name", "Test");
    expect(res.body.userInfo).toHaveProperty("last_name", "Test");
    expect(res.body).toHaveProperty("expiresAt");
    expect(res.body).toHaveProperty("token");
    expect(res.header).toHaveProperty("set-cookie");
  });

  it("should not allow creating of the users that have same email", async () => {
    await authorizedUser
      .post("/sign-up")
      .send({
        email: testEmail,
        password: testPassword,
        confirm_password: testPassword,
        first_name: "Test",
        last_name: "Test",
      })
      .expect(200);

    const res = await authorizedUser
      .post("/sign-up")
      .send({
        email: testEmail,
        password: testPassword,
        confirm_password: testPassword,
        first_name: "Test",
        last_name: "Test",
      })
      .expect(422);

    expect(res.body.errors[0]).toHaveProperty("msg", "User already exists");
  });

  it("should check if the log in of the user is successful", async () => {
    await prisma.user.create({
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
    const res = await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Authentication successful");
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("expiresAt");
    expect(res.body.userInfo).toHaveProperty("id");
    expect(res.body.userInfo).toHaveProperty("email", "tes@test.com");
    expect(res.body.userInfo).toHaveProperty("role", "user");
    expect(res.header).toHaveProperty("set-cookie");
  });

  it("should not log in user if the user credentials are not correct", async () => {
    const res = await authorizedUser
      .post("/log-in")
      .send({
        email: "new@email.com",
        password: "Test1234!",
      })
      .expect(403);

    expect(res.body).toHaveProperty("message", "Wrong email or password");
  });
});
