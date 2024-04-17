const knex = require("../../db/connection.ts");

async function makeDeposit(accountNumber, newBalance) {
  const newBalanceAfterDeposit = await knex("balances")
    .where({ account_number: accountNumber })
    .update({ balance: newBalance }, ["account_number", "balance"]);

  return newBalanceAfterDeposit[0];
}

module.exports = {
  makeDeposit,
};
