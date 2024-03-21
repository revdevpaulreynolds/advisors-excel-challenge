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

function listOneBalance(accountNumber) {
  console.log(accountNumber);
  return knex("balances").select("*").where({ accountNumber });
}

module.exports = {
  populateAllBalances,
  listAllBalances,
  listOneBalance,
};
