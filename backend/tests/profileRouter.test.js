const express = require("express");
const request = require("supertest");

const { PrismaClient } = require("@prisma/client");

const app = express();
const userRouter = require("../routes/userRouter");
const profileRouter = require("../routes/profileRouter");
const cookieParser = require("cookie-parser");

let authorizedUser;
beforeAll(async () => {
  authorizedUser = request.agent(app);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);

app.use("/profiles", profileRouter);

const prisma = new PrismaClient();

describe("Check if Profile Router works", () => {
  it("logging in works, and checks if the set-cookie is present", async () => {
    const res = await authorizedUser
      .post("/log-in")
      .send({ email: "tes@test.com", password: "Test1234!" })
      .expect(200);
    expect(res.headers).toHaveProperty("set-cookie");
  });

  it("Check if GET user profile works", async () => {
    const res = await authorizedUser.get("/profiles/profile").expect(200);
  });

  it("Check if delete method works", async () => {
    const res = await authorizedUser
      .delete("/profiles/profile/delete")
      .expect(200);
  });
});
