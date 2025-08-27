const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
config();

const port = process.env.PORT;

const app = express();
const apiRouter = express.Router();

const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const profileRouter = require("./routes/profileRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
const messageRouter = require("./routes/messageRouter");
const chatRouter = require("./routes/chatRouter");
const groupRouter = require("./routes/groupRouter");

const corsOptions = ["http://localhost:5173"];

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

apiRouter.use("/", userRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/profiles", profileRouter);
apiRouter.use("/profiles/posts", postRouter);
apiRouter.use("/profiles/comments", commentRouter);
apiRouter.use("/profiles/messages", messageRouter);
apiRouter.use("/profiles/chats", chatRouter);
apiRouter.use("/profiles/groups", groupRouter);

// app.use("/api", userRouter);
// app.use("/admin", adminRouter);
// app.use("/profiles", profileRouter);
// app.use("/profiles/posts", postRouter);
// app.use("/profiles/comments", commentRouter);
// app.use("/profiles/messages", messageRouter);
// app.use("/profiles/chats", chatRouter);
// app.use("/profiles/groups", groupRouter);

app.use("/api", apiRouter);

helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
  },
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
});

app.listen(port, () => {
  console.log(`App is listening on the ${port} port`);
});
