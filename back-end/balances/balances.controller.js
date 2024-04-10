const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./balances.service");

async function listAllBalances(req, res, next) {
  return res.json({
    data: await service.listAllBalances(),
  });
}

async function validateAccountNumber(req, res, next) {
  const { accountNumber } = req.params;
  const exists = await service.listOneBalance(accountNumber);
  if (!exists.length)
    return res.json({
      status: 404,
      message: `${accountNumber} is not an existing account number`,
    });
  next();
}

async function listOneBalance(req, res, next) {
  const { accountNumber } = req.params;
  return res.json({
    data: await service.listOneBalance(accountNumber),
  });
}

async function resetBalances(req, res, next) {
  const accounts = await service.resetBalances();
  return res.json({ data: accounts });
}

module.exports = {
  listAllBalances: [asyncErrorBoundary(listAllBalances)],
  listOneBalance: [validateAccountNumber, asyncErrorBoundary(listOneBalance)],
  resetBalances: [asyncErrorBoundary(resetBalances)],
};
