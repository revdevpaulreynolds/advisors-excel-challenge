-- CREATE TABLE
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    account_number INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR NOT NULL,
    credit_limit INTEGER
);

ALTER TABLE accounts ADD CONSTRAINT verify_type
CHECK (type IN ('checking', 'savings', 'credit'));

-- LOAD DATAS
INSERT INTO accounts 
    (account_number, name, amount, type)
VALUES
    (1, 'Johns Checking', 1000, 'checking'),
    (2, 'Janes Savings', 2000, 'savings'),
    (3, 'Jills Credit', -3000, 'credit'),
    (4, 'Bobs Checking', 40000, 'checking'),
    (5, 'Bills Savings', 50000, 'savings'),
    (6, 'Bills Credit', -60000, 'credit'),
    (7, 'Nancy Checking', 70000, 'checking'),
    (8, 'Nancy Savings', 80000, 'savings'),
    (9, 'Nancy Credit', -90000, 'credit');

UPDATE accounts SET credit_limit = 10000 WHERE account_number = 3;
UPDATE accounts SET credit_limit = 60000 WHERE account_number = 6;
UPDATE accounts SET credit_limit = 100000 WHERE account_number = 9;

-- make table for updating balances
DROP TABLE IF EXISTS balances;
CREATE TABLE balances (
    account_number INTEGER PRIMARY KEY,
    balance INTEGER NOT NULL
);

-- populate balances table
INSERT INTO balances (account_number, balance)
SELECT account_number, amount FROM accounts;

-- make table for recording daily withdrawals
DROP TABLE IF EXISTS daily_withdrawal_totals;
CREATE TABLE daily_withdrawal_totals (
    account_number INTEGER PRIMARY KEY,
    month_updated INTEGER,
    date_updated INTEGER,
    daily_total_withdrawn INTEGER,
    CHECK (month_updated <= 12 AND date_updated <= 31)
);

--populating daily withdrawals table
INSERT INTO daily_withdrawal_totals (account_number)
(SELECT account_number FROM accounts);

DROP TABLE IF EXISTS activity_log;
CREATE TABLE activity_log (
    account_number INTEGER,
    transaction_type VARCHAR,
    transaction_amount INTEGER,
    new_balance INTEGER,
    CHECK (transaction_amount <= 1000)
);