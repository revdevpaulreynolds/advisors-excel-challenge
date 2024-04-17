const knex = require("../db/connection.ts");

async function checkCredit(accountNumber) {
  const accountType = await knex("accounts")
    .where({ account_number: accountNumber })
    .select("type")
    .first();
  return accountType.type === "credit";
}

async function getCurrentBalance(accountNumber) {
  const currentBalance = await knex("balances")
    .where({ account_number: accountNumber })
    .select("balance")
    .first();
  return currentBalance;
}

async function addTransactionActivityLog(
  accountNumber,
  transactionType,
  transactionAmount,
  newBalance
) {
  // console.log(accountNumber, transactionType, transactionAmount);
  await knex("activity_log").insert({
    account_number: accountNumber,
    transaction_type: transactionType,
    transaction_amount: transactionAmount,
    new_balance: newBalance,
  });
}

module.exports = {
  checkCredit,
  getCurrentBalance,
  addTransactionActivityLog,
};
