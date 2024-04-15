const knex = require("../db/connection.ts");

async function checkCredit(accountNumber) {
  const accountType = await knex("accounts")
    .where({ account_number: accountNumber })
    .select("type")
    .first();
  return accountType.type === "credit";
}

async function addTransactionActivityLog(
  accountNumber,
  transactionType,
  transactionAmount
) {
  await knex("activity_log").insert({
    account_number: accountNumber,
    transaction_type: transactionType,
    transaction_amount: transactionAmount,
  });
}

module.exports = {
  checkCredit,
  addTransactionActivityLog,
};
