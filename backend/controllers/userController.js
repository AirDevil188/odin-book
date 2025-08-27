const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const {
  verifyPassword,
  createHashedPassword,
  decodeToken,
  singToken,
} = require("../utils/utils");

const validateUser = [
  body("email", "Invalid email address.")
    .isEmail()
    .custom(async (value) => {
      const user = await db.findUser(value);
      if (user) {
        throw new Error("User already exists");
      }
    }),
  body(
    "password",
    "Password must be at least 8 characters long. And it must contain at least one lowercase letter, one uppercase one symbol and one number."
  ).isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  }),
  body("confirm_password", "Passwords must match.").custom((value, { req }) => {
    return value === req.body.password;
  }),
  body("first_name")
    .trim()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("First Name must contain at least one character"),
  body("last_name")
    .trim()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Last Name must contain at least one character"),
];
const signUpUser = [
  validateUser,
  async (req, res, next) => {
    const { email, password, first_name, last_name, avatar } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }

    const hashedPassword = await createHashedPassword(password);
    try {
      const user = await db.createUser(
        email,
        hashedPassword,
        first_name,
        last_name
      );
      const token = await singToken(user);
      const decodedToken = decodeToken(token);
      const expiresAt = decodedToken.exp;

      res.cookie("token", token, {
        httpOnly: true,
      });

      const { role } = user;

      const userInfo = {
        email,
        role,
        first_name,
        last_name,
      };
      return res.json({
        message: "User Created!",
        token,
        userInfo,
        expiresAt,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: "There was a problem with creating your account",
      });
    }
  },
];

const logInUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await db.findUser(email);
  if (!user)
    return res.status(401).json({
      message: "Wrong email or password",
    });

  const match = await verifyPassword(password, user.password);

  if (match) {
    const { ...rest } = user;

    const userInfo = Object.assign({}, { ...rest });

    const token = await singToken(userInfo);
    const decodedToken = decodeToken(token);
    const expiresAt = decodedToken.exp;

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.json({
      message: "Authentication successful",
      token,
      userInfo,
      expiresAt,
    });
  }
};

module.exports = {
  signUpUser,
  logInUser,
};
