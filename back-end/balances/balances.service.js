const knex = require("../db/connection.ts");

function listAllBalances() {
  return knex("accounts");
}

async function listOneBalance(accountNumber) {
  const balance = await knex("balances")
    .select("balance")
    .where({ account_number: accountNumber })
    .first();
  return balance.balance;
}

async function resetBalances() {
  const accountsTableContents = await knex("accounts")
    .select("*")
    .orderBy("account_number");

  accountsTableContents.forEach(async (account) => {
    await knex("balances")
      .where({ account_number: account.account_number })
      .update(
        {
          balance: account.amount,
        },
        ["account_number", "balance"]
      );
  });
  const newBalances = await knex("balances").orderBy("account_number");
  return newBalances;
}

module.exports = {
  listAllBalances,
  listOneBalance,
  resetBalances,
};
