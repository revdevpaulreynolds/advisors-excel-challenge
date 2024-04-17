const knex = require("../../db/connection.ts");

async function listAllBalances() {
  return await knex("accounts");
}

async function listOneBalance(accountNumber) {
  const balance = await knex("balances")
    .select("balance")
    .where({ account_number: accountNumber })
    .first();
  console.log(`balance in service: ${balance}`);
  return balance;
}

module.exports = {
  listAllBalances,
  listOneBalance,
};
