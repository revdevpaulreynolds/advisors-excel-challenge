const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./deposits.service");

async function checkCredit(req, res, next) {
  const { accountNumber, depositAmount } = req.params;
  const depositAmountNum = parseInt(depositAmount);

  if (depositAmountNum > 1000) {
    return next({
      status: 400,
      message: `The deposit limit is $1000, your deposit is $${depositAmountNum}`,
    });
  }

  const currentBalance = await service.checkCredit(accountNumber);
  if (currentBalance < 0) {
    if (currentBalance + depositAmountNum > 0) {
      return next({
        status: 400,
        message: `${depositAmountNum} is more than your balance of ${currentBalance}`,
      });
    }
  }
  res.locals.currentBalance = currentBalance;
  res.locals.depositAmount = depositAmountNum;
  next();
}

async function updateBalance(req, res, next) {
  const { accountNumber } = req.params;

  //calculate new balance & sent it to the DB

  const { currentBalance, depositAmount } = res.locals;
  const newBalance = currentBalance + depositAmount;

  return res.json({
    data: await service.makeDeposit(accountNumber, newBalance),
  });
  // const
}

module.exports = {
  updateBalance: [
    asyncErrorBoundary(checkCredit),
    asyncErrorBoundary(updateBalance),
  ],
};
