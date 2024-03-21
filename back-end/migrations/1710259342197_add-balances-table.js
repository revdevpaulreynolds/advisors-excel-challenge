/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("balances", {
    accountNumber: {
      primaryKey: true,
      unique: true,
      notNull: true,
      type: "integer",
    },
    balance: {
      notNull: true,
      type: "integer",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("balances");
};
