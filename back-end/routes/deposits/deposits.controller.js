const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const service = require("./deposits.service");
const balanceService = require("../../balances/balances.service");
const utilsService = require("../../utils/utils.service");

async function setParams(req, res, next) {
  const { accountNumber, depositAmount } = req.params;
  const isCreditAccount = await utilsService.checkCredit(accountNumber);
  res.locals.isCreditAccount = isCreditAccount;
  res.locals.depositAmount = parseInt(depositAmount);
  res.locals.accountNumber = accountNumber;
  next();
}

async function checkCredit(req, res, next) {
  const { accountNumber, depositAmount, isCreditAccount } = res.locals;

  if (depositAmount > 1000) {
    return res.json({
      status: 400,
      message: `The deposit limit is $1000, your deposit is $${depositAmount}`,
    });
  }

  const currentBalance = await balanceService.listOneBalance(accountNumber);
  if (isCreditAccount && currentBalance <= 0) {
    if (currentBalance + depositAmount > 0) {
      return res.json({
        status: 400,
        message: `${depositAmount} is more than your balance of ${currentBalance}`,
      });
    }
  }
  res.locals.currentBalance = currentBalance;
  next();
}

async function updateBalance(req, res, next) {
  const { accountNumber, currentBalance, depositAmount } = res.locals;

  await utilsService.addTransactionActivityLog(
    accountNumber,
    "deposit",
    depositAmount
  );
  const newBalance = currentBalance + depositAmount;

  return res.json({
    data: await service.makeDeposit(accountNumber, newBalance),
  });
}

module.exports = {
  makeDeposit: [
    asyncErrorBoundary(setParams),
    asyncErrorBoundary(checkCredit),
    asyncErrorBoundary(updateBalance),
  ],
};
