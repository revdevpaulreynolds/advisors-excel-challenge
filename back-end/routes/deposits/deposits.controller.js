const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const service = require("./deposits.service");
const balanceService = require("../balances/balances.service");
const utilsService = require("../../utils/utils.service");

async function setParams(req, res, next) {
  const { accountNumber, depositAmount } = req.params;
  const accountNumberInt = parseInt(accountNumber);
  const depositAmountInt = parseInt(depositAmount);

  if (isNaN(accountNumberInt))
    return next({
      status: 400,
      message: `Your account number must be a number!`,
    });
  if (isNaN(depositAmountInt))
    return next({
      status: 400,
      message: `Your deposit amount must be a number!`,
    });
  const isCreditAccount = await utilsService.checkCredit(accountNumber);

  res.locals.isCreditAccount = isCreditAccount;
  res.locals.depositAmount = depositAmountInt;
  res.locals.accountNumber = accountNumberInt;
  next();
}

async function checkCredit(req, res, next) {
  const { accountNumber, depositAmount, isCreditAccount } = res.locals;

  if (depositAmount > 1000) {
    return next({
      status: 400,
      message: `The deposit limit is $1000, your deposit is $${depositAmount}`,
    });
  }

  const { balance } = await balanceService.listOneBalance(accountNumber);
  const currentBalance = parseInt(balance);
  console.log(currentBalance, typeof currentBalance);
  if (isCreditAccount && currentBalance <= 0) {
    if (currentBalance + depositAmount > 0) {
      return next({
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
  const depositResponse = await service.makeDeposit(accountNumber, newBalance);
  // console.log(`depositResponse in deposit controller: ${depositResponse}`);

  return res.json({
    data: depositResponse,
  });
}

module.exports = {
  makeDeposit: [
    asyncErrorBoundary(setParams),
    asyncErrorBoundary(checkCredit),
    asyncErrorBoundary(updateBalance),
  ],
};
