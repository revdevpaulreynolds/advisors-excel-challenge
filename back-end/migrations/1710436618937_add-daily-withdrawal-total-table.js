/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("daily-withdrawal-totals", {
    accountNumber: {
      notNull: true,
      type: "integer",
    },
    dateUpdated: {
      type: "date",
    },
    dailyTotal: {
      notNull: true,
      type: "integer",
    },
  });
};

exports.down = (pgm) => {};
