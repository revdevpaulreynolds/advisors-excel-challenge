const router = require("express").Router();
const controller = require("./withdrawals.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:accountNumber/:withdrawalAmount")
  .put(controller.withdraw)
  .all(methodNotAllowed);

module.exports = router;
