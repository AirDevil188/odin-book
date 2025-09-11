const { Router } = require("express");

const tokenRouter = Router();

const tokenController = require("../controllers/tokenController");

tokenRouter.post("/refresh", tokenController.getRefreshToken);

// tokenRouter.delete(
//   "/refresh/invalidate",
//   tokenController.invalidateRefreshToken
// );

module.exports = tokenRouter;
