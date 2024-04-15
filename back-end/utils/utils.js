const billDenomination = 5;

const checkBillsDenominationUtil = (transactionAmount) => {
  return transactionAmount % billDenomination === 0;
};

module.exports = {
  checkBillsDenominationUtil,
};
