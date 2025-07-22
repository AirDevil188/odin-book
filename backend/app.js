const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
config();

const port = process.env.PORT;

const app = express();

const userRouter = require("./routes/userRouter");
const profileRouter = require("./routes/profileRouter");
const { attachUser } = require("./middlewares/authorization");

app.use(cors({ origin: "http//:localhost:3000" }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/profiles", profileRouter);

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
