const router = require("express").Router();
const controller = require("./balances.controller");
const methodNotAllowed = require("../../errors/methodNotAllowed");

router.route("/").get(controller.listOneBalance).all(methodNotAllowed);

module.exports = router;
