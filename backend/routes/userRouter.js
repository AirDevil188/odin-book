const { Router } = require("express");

const userController = require("../controllers/userController");

const userRouter = Router();

userRouter.post("/sign-up", userController.signUpUser);

userRouter.post("/log-in", userController.logInUser);

module.exports = userRouter;
