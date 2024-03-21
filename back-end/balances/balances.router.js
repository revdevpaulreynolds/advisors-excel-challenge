const router = require("express").Router();
const controller = require("./balances.controller");

router.route("/").get(controller.listAllBalances);

router.route("/:accountNumber").get(controller.listOneBalance);
// .put(controller.update);

module.exports = router;
