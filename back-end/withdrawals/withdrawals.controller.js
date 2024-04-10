const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./withdrawals.service");

function setParams(req, res, next) {
  const { accountNumber, withdrawalAmount } = req.params;
  res.locals.withdrawalAmount = parseInt(withdrawalAmount);
  res.locals.accountNumber = accountNumber;
  next();
}

function checkIfOverMaximumWithdrawalAmount(req, res, next) {
  const { withdrawalAmount } = res.locals;
  if (withdrawalAmount > 200) {
    return res.json({
      status: 400,
      message: `Your withdrawal request of $${withdrawalAmount} exceeds the maximum amount of $200.`,
    });
  }
  next();
}

async function checkDailyWithdrawalAmount(req, res, next) {
  const { accountNumber, withdrawalAmount } = res.locals;
  const todaysDate = new Date();
  const currentMonth = todaysDate.getMonth();
  const dateOfLastWithdrawal = service.getDateOfLastWithdrawal(accountNumber);
  const todaysWithdrawalAmount = service.getDailyWithdrawalTotal(accountNumber);
  next();
}

async function withdraw(req, res, next) {
  return res.json({ status: 200, message: "Just a little bit poorer" });
}

module.exports = {
  withdraw: [
    setParams,
    checkIfOverMaximumWithdrawalAmount,
    asyncErrorBoundary(checkDailyWithdrawalAmount),
    asyncErrorBoundary(withdraw),
  ],
};
