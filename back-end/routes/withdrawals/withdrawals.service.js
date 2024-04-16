const knex = require("../../db/connection.ts");

async function getCreditLimit(accountNumber) {
  const creditLimit = await knex("accounts")
    .column("credit_limit")
    .where({ account_number: accountNumber })
    .first();
  return creditLimit.credit_limit;
}

async function getDateOfLastWithdrawal(accountNumber) {
  const dateOfLastWithdrawal = await knex("daily_withdrawal_totals")
    .column("month_updated", "date_updated")
    .select("*")
    .where({ account_number: accountNumber })
    .first();

  // console.log("dateOfLastWithdrawal: ", dateOfLastWithdrawal);
  return dateOfLastWithdrawal;
}

async function getDailyWithdrawalTotal(
  accountNumber,
  currentMonth,
  currentDate
) {
  const todaysWithdrawalTotal = (await knex("daily_withdrawal_totals")
    .column("daily_total_withdrawn")
    .where({
      account_number: accountNumber,
      month_updated: currentMonth,
      date_updated: currentDate,
    })
    .first()) || { daily_total_withdrawn: null };
  return todaysWithdrawalTotal;
}

async function updateWithdrawalDate(accountNumber, currentMonth, currentDate) {
  const updatedDate = await knex("daily_withdrawal_totals")
    .where({ account_number: accountNumber })
    .update(
      {
        month_updated: currentMonth,
        date_updated: currentDate,
      },
      ["account_number", "month_updated", "date_updated"]
    );
  return updatedDate;
}

async function updateWithdrawalAmount(accountNumber, withdrawalAmount) {
  const updatedDailyWithdrawalAmount = await knex("daily_withdrawal_totals")
    .where({ account_number: accountNumber })
    .update(
      {
        daily_total_withdrawn: withdrawalAmount,
      },
      ["account_number", "daily_total_withdrawn"]
    );
  console.table(updatedDailyWithdrawalAmount);
  return updatedDailyWithdrawalAmount[0];
}

module.exports = {
  getCreditLimit,
  getDateOfLastWithdrawal,
  getDailyWithdrawalTotal,
  updateWithdrawalDate,
  updateWithdrawalAmount,
};
