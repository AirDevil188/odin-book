const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { config } = require("dotenv");
config();

const port = process.env.PORT;

const app = express();

app.use(cors({ origin: "http//:localhost:3000" }));
app.use(helmet());

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
