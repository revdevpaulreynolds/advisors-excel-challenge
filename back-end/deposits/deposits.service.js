const knex = require("../db/connection.ts");
const { listOneBalance } = require("../balances/balances.service");

async function makeDeposit(accountNumber, newBalance) {
  const query = await knex("balances")
    .where({ account_number: accountNumber })
    .update({ balance: newBalance }, ["account_number", "balance"]);

  return query;
}

module.exports = {
  makeDeposit,
};
