const balancesService = require("../routes/balances/balances.service");

const checkBillsDenominationUtil = (transactionAmount) => {
  const billDenomination = 5;

  return transactionAmount % billDenomination === 0;
};

async function getOneBalance(req, res, next) {
  const { accountNumber } = req.params;
  if (accountNumber === "all") {
    console.log(accountNumber);
    return res.json({
      data: { allBalances: await balancesService.listAllBalances() },
    });
  }
  const accountNumberInt = parseInt(accountNumber);
  if (isNaN(accountNumberInt))
    return next({
      status: 400,
      message: `Your account number must be a number!`,
    });

  const { balance } =
    (await balancesService.listOneBalance(accountNumber)) || "";

  if (isNaN(balance)) {
    return next({
      status: 404,
      message: `${accountNumber} is not an existing account number`,
    });
  }

  console.log(`balance in utils: ${balance}`);
  if (!isNaN(balance)) {
    res.locals.currentBalance = balance;
    res.locals.accountNumber = accountNumberInt;
  }
  return next();
}

module.exports = {
  checkBillsDenominationUtil,
  getOneBalance,
};
