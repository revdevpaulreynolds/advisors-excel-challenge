var express = require("express");
var router = express.Router();
const db = require("../db/connection.ts");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const dbContents = await db.select("*").from("accounts");
  console.table(dbContents);
  const balanceContents = await db.select("*").from("balances");
  if (!balanceContents.length) {
    dbContents.forEach((account) => {
      console.log(account.account_number);
      db("balances")
        .insert(
          { accountNumber: account.account_number, balance: account.amount },
          ["accountNumber", "balance"]
        )
        .then((ret) => {
          console.log(ret);
        });
    });
  }
  const updatedBalance = await db.select("*").from("balances");
  console.table(updatedBalance);
  // console.table(balanceContents);
  res.render("index", {
    title: "Express",
  });
});

module.exports = router;
