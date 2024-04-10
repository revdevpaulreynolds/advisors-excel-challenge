const knex = require("../db/connection.ts");

async function getDateOfLastWithdrawal(accountNumber) {
  const dateOfLastWithdrawal = await knex("daily-withdrawal-totals")
    .column("dateUpdated")
    .select("*")
    .where({ accountNumber })
    .first();

  console.log("dateOfLastWithdrawal: ", dateOfLastWithdrawal);
  return dateOfLastWithdrawal;
}

async function getDailyWithdrawalTotal(accountNumber) {
  const today = new Date().getDate();
  console.log(today);
}

module.exports = {
  getDateOfLastWithdrawal,
  getDailyWithdrawalTotal,
};
