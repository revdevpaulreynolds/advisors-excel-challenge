const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const service = require("./deposits.service");
const balanceService = require("../balances/balances.service");
const utilsService = require("../../utils/utils.service");

async function setParams(req, res, next) {
  const { depositAmount } = req.params;
  const { accountNumber, currentBalance } = res.locals;
  console.log(
    `currentBalance in deposits controller setparams: ${currentBalance}`
  );
  const depositAmountInt = parseInt(depositAmount);

  if (isNaN(depositAmountInt))
    return next({
      status: 400,
      message: `Your deposit amount must be a number!`,
    });
  const isCreditAccount = await utilsService.checkCredit(accountNumber);

  res.locals.isCreditAccount = isCreditAccount;
  res.locals.depositAmount = depositAmountInt;
  res.locals.updatedBalanceAfterDeposit = currentBalance + depositAmountInt;
  next();
}

async function checkCredit(req, res, next) {
  const {
    currentBalance,
    depositAmount,
    isCreditAccount,
    updatedBalanceAfterDeposit,
  } = res.locals;

  if (depositAmount > 1000) {
    return next({
      status: 400,
      message: `The deposit limit is $1000, your deposit is $${depositAmount}`,
    });
  }

  if (isCreditAccount && updatedBalanceAfterDeposit > 0) {
    return next({
      status: 400,
      message: `${depositAmount} is more than your balance of ${currentBalance}`,
    });
  }
  next();
}

async function makeDeposit(req, res, next) {
  const { accountNumber, currentBalance, depositAmount } = res.locals;
  const newBalance = currentBalance + depositAmount;
  await utilsService.addTransactionActivityLog(
    accountNumber,
    "deposit",
    depositAmount,
    newBalance
  );
  const depositResponse = await service.makeDeposit(accountNumber, newBalance);
  // console.log(`depositResponse in deposit controller: ${depositResponse}`);

  return res.json({
    data: {
      ...depositResponse,
      transaction_amount: depositAmount,
      transaction_type: "deposit",
    },
  });
}

module.exports = {
  makeDeposit: [
    asyncErrorBoundary(setParams),
    asyncErrorBoundary(checkCredit),
    asyncErrorBoundary(makeDeposit),
  ],
};
