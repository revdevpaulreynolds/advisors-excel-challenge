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

async function withdraw(req, res, next) {}

module.exports = {
  withdraw: [
    setParams,
    checkIfOverMaximumWithdrawalAmount,
    asyncErrorBoundary(withdraw),
  ],
};
