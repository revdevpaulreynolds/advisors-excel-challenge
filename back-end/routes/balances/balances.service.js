const knex = require("../../db/connection.ts");

async function listAllBalances() {
  return await knex("balances");
}

async function listOneBalance(accountNumber) {
  const balance = await knex("balances")
    .select("balance")
    .where({ account_number: accountNumber })
    .first();
  return balance;
}

module.exports = {
  listAllBalances,
  listOneBalance,
};
