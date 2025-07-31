const express = require("express");
const request = require("supertest");
const { config } = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { createHashedPassword } = require("../utils/utils");

config();

process.env.NODE_ENV = "TEST";

const userRouter = require("../routes/userRouter");
const profileRouter = require("../routes/profileRouter");
const postRouter = require("../routes/postRouter");
const cookieParser = require("cookie-parser");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/profiles", profileRouter);
app.use("/profiles/posts", postRouter);

describe("Post router functionality", () => {
  let authorizedUser;
  let hashedPassword;
  const testEmail = "tes@test.com";
  const testPassword = "Test1234!";

  beforeAll(async () => {
    hashedPassword = await createHashedPassword(testPassword);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.post.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  authorizedUser = request.agent(app);

  it("creates new post", async () => {
    const testUser = await prisma.user.create({
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

    const userId = testUser.id;
    const testText = "First test post";

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .post(`/profiles/posts/${userId}/new`)
      .send({
        text: testText,
      })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Post created successfully");
    expect(res.body.post).toHaveProperty("id");
    expect(res.body.post).toHaveProperty("likes");
    expect(res.body.post).toHaveProperty("createdAt");
    expect(res.body.post).toHaveProperty("text", testText);
    expect(res.body.post).toHaveProperty("authorId", userId);
  });

  it("should update post", async () => {
    const testUser = await prisma.user.create({
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

    const testText = "First test post";
    const testUpdatedText = "Updated test post";
    const userId = testUser.id;

    const testPost = await prisma.post.create({
      data: {
        text: testText,
        authorId: userId,
      },
    });
    const postId = testPost.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put(`/profiles/posts/${userId}/${postId}/update`)
      .send({ postId: postId, text: testUpdatedText })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Post updated successfully");
    expect(res.body.post).toHaveProperty("id");
    expect(res.body.post).toHaveProperty("createdAt");
    expect(res.body.post).toHaveProperty("updatedAt");
    expect(res.body.post).toHaveProperty("likes");
    expect(res.body.post).toHaveProperty("text", testUpdatedText);
  });

  it("should delete post", async () => {
    const testUser = await prisma.user.create({
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

    const testText = "First test post";

    const userId = testUser.id;

    const testPost = await prisma.post.create({
      data: {
        text: testText,
        authorId: userId,
      },
    });
    const postId = testPost.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .delete(`/profiles/posts/${userId}/${postId}/delete`)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Post deleted successfully");
    expect(res.body.post).toHaveProperty("id");
    expect(res.body.post).toHaveProperty("text", testText);
    expect(res.body.post).toHaveProperty("createdAt");
    expect(res.body.post).toHaveProperty("authorId", userId);
  });

  it("should like a post", async () => {
    const testText = "First test post";
    const testUser = await prisma.user.create({
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
    const userId = testUser.id;
    const testPost = await prisma.post.create({
      data: {
        text: testText,
        authorId: userId,
      },
    });
    const postId = testPost.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put(`/profiles/posts/${userId}/${postId}/like`)
      .expect(200);

    expect(res.body.post).toHaveProperty("id", postId);
    expect(res.body.post).toHaveProperty("likes", 1);
  });
  it("should dislike a post", async () => {
    const testText = "First test post";
    const testUser = await prisma.user.create({
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
    const userId = testUser.id;
    const testPost = await prisma.post.create({
      data: {
        text: testText,
        authorId: userId,
        likes: 1,
        likedBy: {
          create: {
            userId: userId,
          },
        },
      },
    });
    const postId = testPost.id;
    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put(`/profiles/posts/${userId}/${postId}/like`)
      .expect(200);

    expect(res.body.post).toHaveProperty("id", postId);
    expect(res.body.post).toHaveProperty("likes", 0);
  });
});
