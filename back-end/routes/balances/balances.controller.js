const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const service = require("./balances.service");

async function listAllBalances(req, res, next) {
  return res.json({
    data: await service.listAllBalances(),
  });
}

async function listOneBalance(req, res, next) {
  const { accountNumber } = req.params;
  const balance = await service.listOneBalance(accountNumber);
  if (!balance) {
    return next({
      status: 404,
      message: `${accountNumber} is not an existing account number`,
    });
  }
  return res.json({
    data: balance,
  });
}

module.exports = {
  listAllBalances: [asyncErrorBoundary(listAllBalances)],
  listOneBalance: [asyncErrorBoundary(listOneBalance)],
};
