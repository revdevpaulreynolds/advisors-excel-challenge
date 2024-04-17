const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const service = require("./balances.service");
const utils = require("../../utils/utils");

async function listOneBalance(req, res, next) {
  const { accountNumber, currentBalance } = res.locals;

  return res.json({
    data: { account_number: accountNumber, balance: currentBalance },
  });
}

module.exports = {
  listOneBalance: [asyncErrorBoundary(listOneBalance)],
};
