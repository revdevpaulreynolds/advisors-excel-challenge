const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./deposits.controller");

router
  .route("/:accountNumber/:depositAmount")
  .put(controller.updateBalance)
  .all(methodNotAllowed);

module.exports = router;
