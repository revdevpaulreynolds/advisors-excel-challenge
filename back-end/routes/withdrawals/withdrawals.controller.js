const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const service = require("./withdrawals.service");
const { checkBillsDenominationUtil } = require("../../utils/utils");
const utilsService = require("../../utils/utils.service");

async function setParams(req, res, next) {
  const { withdrawalAmount } = req.params;
  const { accountNumber, currentBalance } = res.locals;
  const withdrawalAmountInt = parseInt(withdrawalAmount);

  if (isNaN(withdrawalAmountInt))
    return next({
      status: 400,
      message: `Your withdrawal amount must be a number!`,
    });

  const isCreditAccount = await utilsService.checkCredit(accountNumber);
  if (isCreditAccount) {
    const creditLimit = await service.getCreditLimit(accountNumber);
    res.locals.creditLimit = creditLimit;
  }
  res.locals.isCreditAccount = isCreditAccount;
  res.locals.withdrawalAmount = withdrawalAmountInt;
  res.locals.updatedBalanceAfterWithdraw = currentBalance - withdrawalAmountInt;
  next();
}

async function checkIfOverCreditLimit(req, res, next) {
  const { withdrawalAmount, isCreditAccount, creditLimit, currentBalance } =
    res.locals;

  if (!isCreditAccount) return next();
  const intendedNewCreditBalance = -Math.abs(currentBalance - withdrawalAmount);
  const relationToCreditLimit = creditLimit + intendedNewCreditBalance;
  if (relationToCreditLimit < 0)
    return next({
      status: 400,
      message: `Your credit limit of ${creditLimit} is exceeded by ${-relationToCreditLimit}`,
    });
  next();
}

async function checkIfOverdraft(req, res, next) {
  const { withdrawalAmount, isCreditAccount, currentBalance } = res.locals;
  if (isCreditAccount) {
    return next();
  }
  if (currentBalance < withdrawalAmount) {
    return next({
      status: 400,
      message: `Your withdrawal request of $${withdrawalAmount} exceeds your current balance of $${currentBalance}.`,
    });
  }
  console.log(currentBalance, withdrawalAmount);
  next();
}

function checkIfOverMaximumWithdrawalAmount(req, res, next) {
  const { withdrawalAmount } = res.locals;
  if (withdrawalAmount > 200) {
    return next({
      status: 400,
      message: `Your withdrawal request of $${withdrawalAmount} exceeds the maximum amount of $200.`,
    });
  }
  next();
}

function checkBillsDenomination(req, res, next) {
  const { withdrawalAmount } = res.locals;
  if (!checkBillsDenominationUtil(withdrawalAmount)) {
    return next({
      status: 400,
      message: `This machine dispenses bills in multiples of $5`,
    });
  }
  next();
}

async function checkDailyWithdrawalAmount(req, res, next) {
  const { accountNumber, withdrawalAmount } = res.locals;
  const todaysDate = new Date();
  const currentMonth = todaysDate.getMonth() + 1;
  const currentDate = todaysDate.getDate();

  const { daily_total_withdrawn: todaysWithdrawalTotal } =
    await service.getDailyWithdrawalTotal(
      accountNumber,
      currentMonth,
      currentDate
    );
  if (todaysWithdrawalTotal + withdrawalAmount > 400) {
    return next({
      status: 400,
      message: "You cannot withdraw more than $400 in one day.",
    });
  }
  res.locals.currentMonth = currentMonth;
  res.locals.currentDate = currentDate;
  res.locals.todaysWithdrawalTotal = todaysWithdrawalTotal || 0;
  next();
}

async function withdraw(req, res, next) {
  const {
    accountNumber,
    withdrawalAmount,
    currentMonth,
    currentDate,
    todaysWithdrawalTotal,
    updatedBalanceAfterWithdraw,
  } = res.locals;

  await service.updateWithdrawalDate(accountNumber, currentMonth, currentDate);

  const newDailyWithdrawalTotal = withdrawalAmount + todaysWithdrawalTotal;
  // const { daily_total_withdrawn: updateWithdrawalAmount } =
  await service.updateDailyWithdrawalTotal(
    accountNumber,
    newDailyWithdrawalTotal
  );

  await utilsService.addTransactionActivityLog(
    accountNumber,
    "withdrawal",
    withdrawalAmount,
    updatedBalanceAfterWithdraw
  );

  const withdrawCompletedConfirmation = await service.makeWithdrawal(
    accountNumber,
    updatedBalanceAfterWithdraw
  );

  return res.json({
    data: withdrawCompletedConfirmation,
  });
}

module.exports = {
  withdraw: [
    asyncErrorBoundary(setParams),
    checkIfOverCreditLimit,
    asyncErrorBoundary(checkIfOverdraft),
    checkIfOverMaximumWithdrawalAmount,
    checkBillsDenomination,
    asyncErrorBoundary(checkDailyWithdrawalAmount),
    asyncErrorBoundary(withdraw),
  ],
};
