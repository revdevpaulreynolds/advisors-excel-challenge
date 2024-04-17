const router = require("express").Router();
const controller = require("./withdrawals.controller");
const methodNotAllowed = require("../../errors/methodNotAllowed");

router
  .route("/:withdrawalAmount")
  .put(controller.withdraw)
  .all(methodNotAllowed);

module.exports = router;
