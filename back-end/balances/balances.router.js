const router = require("express").Router();
const controller = require("./balances.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.listAllBalances).all(methodNotAllowed);

router
  .route("/:accountNumber")
  .get(controller.listOneBalance)
  .all(methodNotAllowed);
// .put(controller.update);

module.exports = router;
