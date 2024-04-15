const knex = require("../db/connection.ts");

async function populateAllBalances() {
  const balancesTableContents = await knex("balances").select("*");
  if (!balancesTableContents.length) {
    const accountsTableContents = await knex("accounts").select("*");
    accountsTableContents.forEach((account) => {
      knex("balances")
        .insert(
          {
            account_number: account.account_number,
            balance: account.amount,
          },
          ["account_number", "balance"]
        )
        .then((ret) => {
          console.log(ret);
        });
    });
    return;
  }
  return console.error("Balances table already populated");
}

function listAllBalances() {
  return knex("accounts");
  // return knex("balances").select("*");
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
  populateAllBalances,
  listAllBalances,
  listOneBalance,
  resetBalances,
};
