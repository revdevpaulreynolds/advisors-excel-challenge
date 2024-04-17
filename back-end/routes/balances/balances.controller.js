const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const service = require("./balances.service");
const utils = require("../../utils/utils");

async function listAllBalances(req, res, next) {
  return res.json({
    data: await service.listAllBalances(),
  });
}

async function listOneBalance(req, res, next) {
  const { accountNumber, currentBalance } = res.locals;

  return res.json({
    data: { account_number: accountNumber, balance: currentBalance },
  });
}

module.exports = {
  listAllBalances: [asyncErrorBoundary(listAllBalances)],
  listOneBalance: [asyncErrorBoundary(listOneBalance)],
};
