const knex = require("../db/connection.ts");
const { listOneBalance } = require("../balances/balances.service");

async function checkCredit(accountNumber) {
  const myBalance = await listOneBalance(accountNumber);
  const accountType = await knex("accounts")
    .where({ account_number: accountNumber })
    .select("type")
    .first();

  return accountType.type === "credit";
}

function makeDeposit(accountNumber, newBalance) {
  return knex("balances")
    .where({ accountNumber })
    .update({ balance: newBalance }, ["accountNumber", "balance"]);
}

module.exports = {
  checkCredit,
  makeDeposit,
};
