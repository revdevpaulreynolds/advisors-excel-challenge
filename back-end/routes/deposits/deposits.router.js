const router = require("express").Router();
const methodNotAllowed = require("../../errors/methodNotAllowed");
const controller = require("./deposits.controller");

router
  .route("/:depositAmount")
  .put(controller.makeDeposit)
  .all(methodNotAllowed);

module.exports = router;
