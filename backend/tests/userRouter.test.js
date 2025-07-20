const request = require("supertest");
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const userRouter = require("../routes/userRouter");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);

const prisma = new PrismaClient();

describe("Test if Sign Up route works", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("all fields are required", (done) => {
    request(app)
      .post("/sign-up")
      .type("form")
      .send({ password: "Test1234!", confirm_password: "Test1234!" })
      .expect(422, done);
  });

  it("confirm_password must match with password field", (done) => {
    request(app)
      .post("/sign-up")
      .type("form")
      .send({
        email: "tes@test.com",
        password: "Test1234!",
        confirm_password: "Test1235!",
      })
      .then((res) => {
        expect(res.body.errors[0].msg).toEqual("Passwords must match.");
        done();
      });
  });

  it("password must be at least 8 characters long. Password must have one uppercase, letter, number and special symbol.", (done) => {
    request(app)
      .post("/sign-up")
      .type("form")
      .send({
        email: "tes@test.com",
        password: "1234s",
        confirm_password: "1234s",
      })
      .then((res) => {
        expect(res.body.errors[0].msg).toEqual(
          "Password must be at least 8 characters long. And it must contain at least one lowercase letter, one uppercase one symbol and one number."
        );
        done();
      });
  });

  it("sign-up works", (done) => {
    request(app)
      .post("/sign-up")
      .type("form")
      .send({
        email: "tes@test.com",
        password: "Test1234!",
        confirm_password: "Test1234!",
      })
      .expect(200, done);
  });
});

describe("Test if Log In Route works", () => {
  it("logging in works, and checks if the set-cookie is present", (done) => {
    request(app)
      .post("/log-in")
      .type("form")
      .send({ email: "tes@test.com", password: "Test1234!" })
      .expect(200)
      .then((res) => {
        expect(res.headers).toHaveProperty("set-cookie");
        done();
      });
  });

  it("403 error if logging in credentials are wrong", (done) => {
    request(app)
      .post("/log-in")
      .type("form")
      .send({ email: "examoles@email.com", password: "test1234!" })
      .expect(403, done);
  });
});
