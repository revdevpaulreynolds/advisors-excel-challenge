const knex = require("../db/connection.ts");
const { listOneBalance } = require("../balances/balances.service");

async function checkCredit(accountNumber) {
  console.log("checkCredit running", accountNumber);
  const myBalance = await listOneBalance(accountNumber);
  return myBalance[0].balance;
}

function makeDeposit(accountNumber, newBalance) {
  console.log(accountNumber, newBalance);
  return knex("balances")
    .where({ accountNumber })
    .update({ balance: newBalance }, ["accountNumber", "balance"]);
}

module.exports = {
  checkCredit,
  makeDeposit,
};
