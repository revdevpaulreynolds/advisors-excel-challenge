const knex = require("../db/connection.ts");

async function checkCredit(accountNumber) {
  const accountType = await knex("accounts")
    .where({ account_number: accountNumber })
    .select("type")
    .first();
  return accountType.type === "credit";
}

module.exports = {
  checkCredit,
};
