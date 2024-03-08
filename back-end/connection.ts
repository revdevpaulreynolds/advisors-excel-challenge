const pgp = require("pg-promise")();
const db = pgp({
  host: "localhost",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

db.any('SELECT * FROM accounts')
  .then((data) => {
    console.log(data);
  })
  .catch(err => {
    console.log(err)
  })

module.exports = db;