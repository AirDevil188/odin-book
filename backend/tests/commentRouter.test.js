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
const commentRouter = require("../routes/commentRouter");
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
app.use("/profiles/comments", commentRouter);

describe("Test Comment router functionality", () => {
  const testEmail = "test@test.com";
  const testPassword = "Test1234!";
  let hashedPassword;
  let authorizedUser;

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
  });

  authorizedUser = request.agent(app);

  it("should create new comment", async () => {
    const testText = "First test post";

    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Tes",
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
      .post(`/profiles/comments/${postId}/new`)
      .send({ text: testText })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Comment created successfully");
    expect(res.body.comment).toHaveProperty("id");
    expect(res.body.comment).toHaveProperty("createdAt");
    expect(res.body.comment).toHaveProperty("updatedAt");
    expect(res.body.comment).toHaveProperty("text", testText);
    expect(res.body.comment).toHaveProperty("authorId", userId);
    expect(res.body.comment).toHaveProperty("postId", postId);
  });

  it("should update comment", async () => {
    const testText = "First test post";
    const testUpdatedText = "Comment updated";

    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Tes",
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

    const testComment = await prisma.comment.create({
      data: {
        text: testText,
        authorId: userId,
        postId: postId,
      },
    });

    const commentId = testComment.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);
    const res = await authorizedUser
      .put(`/profiles/comments/${commentId}/update`)
      .send({
        text: "Comment updated",
      });

    expect(res.body).toHaveProperty("message", "Comment updated successfully");
    expect(res.body.comment).toHaveProperty("id", commentId);
    expect(res.body.comment).toHaveProperty("authorId", userId);
    expect(res.body.comment).toHaveProperty("postId", postId);
    expect(res.body.comment).toHaveProperty("createdAt");
    expect(res.body.comment).toHaveProperty("updatedAt");
    expect(res.body.comment).toHaveProperty("text", testUpdatedText);
  });

  it("should delete a comment", async () => {
    const testText = "First test post";

    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Tes",
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

    const testComment = await prisma.comment.create({
      data: {
        text: testText,
        authorId: userId,
        postId: postId,
      },
    });

    const commentId = testComment.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .delete(`/profiles/comments/${commentId}/delete`)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Comment deleted successfully");
    expect(res.body.comment).toHaveProperty("id", commentId);
    expect(res.body.comment).toHaveProperty("authorId", userId);
    expect(res.body.comment).toHaveProperty("postId", postId);
    expect(res.body.comment).toHaveProperty("text", testText);
    expect(res.body.comment).toHaveProperty("createdAt");
    expect(res.body.comment).toHaveProperty("updatedAt");
  });

  it("should like a comment", async () => {
    const testText = "First test post";

    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Tes",
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

    const testComment = await prisma.comment.create({
      data: {
        text: testText,
        authorId: userId,
        postId: postId,
      },
    });

    const commentId = testComment.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser.put(
      `/profiles/comments/${commentId}/like`
    );

    expect(res.body).toHaveProperty("message", "Comment liked successfully");
    expect(res.body.comment).toHaveProperty("id", commentId);
    expect(res.body.comment).toHaveProperty("authorId");
    expect(res.body.comment).toHaveProperty("postId", postId);
    expect(res.body.comment).toHaveProperty("likes", 1);
  });

  it("should dislike a comment", async () => {
    const testText = "First test post";

    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        profile: {
          create: {
            firstName: "Test",
            lastName: "Tes",
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

    const testComment = await prisma.comment.create({
      data: {
        text: testText,
        authorId: userId,
        postId: postId,
        likes: 1,
        likedBy: {
          create: {
            userId: userId,
          },
        },
      },
    });

    const commentId = testComment.id;

    await authorizedUser
      .post("/log-in")
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const res = await authorizedUser
      .put(`/profiles/comments/${commentId}/like`)
      .expect(200);

    expect(res.body.comment).toHaveProperty("id", commentId);
    expect(res.body.comment).toHaveProperty("likes", 0);
  });
});
