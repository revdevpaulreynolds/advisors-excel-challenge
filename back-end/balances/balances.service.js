const knex = require("../db/connection.ts");

async function populateAllBalances() {
  const balancesTableContents = await knex("balances").select("*");
  if (!balancesTableContents.length) {
    const accountsTableContents = await knex("accounts").select("*");
    accountsTableContents.forEach((account) => {
      knex("balances")
        .insert(
          {
            accountNumber: account.account_number,
            balance: account.amount,
          },
          ["accountNumber", "balance"]
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
  return knex("balances").select("*");
}

async function listOneBalance(accountNumber) {
  const balance = await knex("balances")
    .select("balance")
    .where({ accountNumber })
    .first();
  return balance.balance;
}

async function resetBalances() {
  const accountsTableContents = await knex("accounts")
    .select("*")
    .orderBy("account_number");

  accountsTableContents.forEach(async (account) => {
    await knex("balances")
      .where({ accountNumber: account.account_number })
      .update(
        {
          balance: account.amount,
        },
        ["accountNumber", "balance"]
      );
  });
  const newBalances = await knex("balances").orderBy("accountNumber");
  return newBalances;
}

module.exports = {
  populateAllBalances,
  listAllBalances,
  listOneBalance,
  resetBalances,
};
