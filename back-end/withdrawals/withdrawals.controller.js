const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./withdrawals.service");
const { checkBillsDenominationUtil } = require("../utils/utils");
const balancesService = require("../balances/balances.service");
const utilsService = require("../utils/utils.service");

async function setParams(req, res, next) {
  const { accountNumber, withdrawalAmount } = req.params;
  const isCreditAccount = await utilsService.checkCredit(accountNumber);
  if (isCreditAccount) {
    const creditLimit = await service.getCreditLimit(accountNumber);
    res.locals.creditLimit = creditLimit;
  }
  res.locals.isCreditAccount = isCreditAccount;
  res.locals.withdrawalAmount = parseInt(withdrawalAmount);
  res.locals.accountNumber = parseInt(accountNumber);
  next();
}

async function checkIfOverdraft(req, res, next) {
  const { accountNumber, withdrawalAmount, isCreditAccount } = res.locals;
  if (isCreditAccount) {
    return next();
  }
  const currentBalance = await balancesService.listOneBalance(accountNumber);
  if (currentBalance < withdrawalAmount) {
    return res.json({
      status: 400,
      message: `Your withdrawal request of $${withdrawalAmount} exceeds your current balance of $${currentBalance}.`,
    });
  }
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

function checkBillsDenomination(req, res, next) {
  const { withdrawalAmount } = res.locals;
  if (!checkBillsDenominationUtil(withdrawalAmount)) {
    return res.json({
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
  const dateOfLastWithdrawal = await service.getDateOfLastWithdrawal(
    accountNumber,
    currentMonth,
    currentDate
  );
  const { daily_total_withdrawn: todaysWithdrawalTotal } =
    await service.getDailyWithdrawalTotal(
      accountNumber,
      currentMonth,
      currentDate
    );
  console.log(todaysWithdrawalTotal);
  res.locals.currentMonth = currentMonth;
  res.locals.currentDate = currentDate;
  next();
}

async function withdraw(req, res, next) {
  const { accountNumber, withdrawalAmount, currentMonth, currentDate } =
    res.locals;
  const updateWithdrawalDate = await service.updateWithdrawalDate(
    accountNumber,
    currentMonth,
    currentDate
  );
  const { daily_total_withdrawn: updateWithdrawalAmount } =
    await service.updateWithdrawalAmount(accountNumber, withdrawalAmount);
  console.log(`updateWithdrawalDate: ${updateWithdrawalDate}`);
  console.table(`updatedWithdrawalAmount: ${updateWithdrawalAmount}`);
  return res.json({
    status: 200,
    message: `Withdrew ${updateWithdrawalAmount}`,
  });
}

module.exports = {
  withdraw: [
    asyncErrorBoundary(setParams),
    asyncErrorBoundary(checkIfOverdraft),
    checkIfOverMaximumWithdrawalAmount,
    checkBillsDenomination,
    asyncErrorBoundary(checkDailyWithdrawalAmount),
    asyncErrorBoundary(withdraw),
  ],
};
