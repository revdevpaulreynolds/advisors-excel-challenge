const balancesService = require("../routes/balances/balances.service");

const billDenomination = 5;

const checkBillsDenominationUtil = (transactionAmount) => {
  return transactionAmount % billDenomination === 0;
};

async function getOneBalance(req, res, next) {
  const { accountNumber } = req.params;
  const accountNumberInt = parseInt(accountNumber);
  if (isNaN(accountNumberInt))
    return next({
      status: 400,
      message: `Your account number must be a number!`,
    });

  const { balance } =
    (await balancesService.listOneBalance(accountNumber)) || "";

  if (!balance) {
    return next({
      status: 404,
      message: `${accountNumber} is not an existing account number`,
    });
  }

  console.log(`balance in utils: ${balance}`);
  if (balance) {
    res.locals.currentBalance = balance;
    res.locals.accountNumber = accountNumberInt;
  }
  return next();
}

module.exports = {
  checkBillsDenominationUtil,
  getOneBalance,
};
