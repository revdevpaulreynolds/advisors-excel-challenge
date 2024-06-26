import React, { useState } from "react";
import { getBalance, makeDeposit, makeWithdrawal } from "./utils/api";
import Form from "./Form";
import { Grid, Paper, Card, Typography } from "@mui/material";

type Request = {
  account_number: string;
  transaction_amount: number;
  request_type: string;
};

type FormInput = {
  account_number: string;
  transaction_amount: number;
  request_type: string;
};

type Response = {
  account_number?: number;
  balance?: number;
  allBalances?: { account_number: number; balance: number }[];
  transaction_type?: string;
  transaction_amount?: number;
};

type Error = {
  message?: string;
};

function Home({
  initialState = {
    account_number: "",
    transaction_amount: 0,
    request_type: "",
  },
}) {
  const [formInput, setFormInput] = useState<FormInput>(initialState);
  const [response, setResponse] = useState<Response>({});
  const [error, setError] = useState<Error>({});
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [displayBalance, setDisplayBalance] = useState<string | null>(null);

  const formatBalance = (balance: number): string => {
    return balance.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setResponse({});
    setError({});
    const ac = new AbortController();

    const request: Request = {
      ...formInput,
      account_number: formInput.account_number,
    };

    const responseSetter = (apiResponse: Response) => {
      setResponse(apiResponse),
        setAccountNumber(apiResponse.account_number?.toString() || "");
      apiResponse.balance &&
        setDisplayBalance(formatBalance(apiResponse.balance) || null);
    };

    switch (request.request_type) {
      case "balanceInquiry":
        await getBalance(request.account_number, ac.signal)
          .then((res) => {
            responseSetter(res);
          })
          .catch((err) => {
            setError(err);
          });
        break;
      case "deposit":
        await makeDeposit(
          request.account_number,
          request.transaction_amount,
          ac.signal
        )
          .then((res) => {
            responseSetter(res);
          })
          .catch(setError);
        break;
      case "withdrawal":
        await makeWithdrawal(
          request.account_number,
          request.transaction_amount,
          ac.signal
        )
          .then((res) => {
            responseSetter(res);
          })
          .catch(setError);
    }
    setFormInput({
      ...initialState,
      account_number: accountNumber?.toString() || "",
    });
    return () => ac.abort();
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const displayMessage = {
    balanceInquiry: `Your account's balance is ${displayBalance}`,
    deposit: `Your account's balance is ${displayBalance} after a deposit of $${response.transaction_amount}`,
    withdrawal: `Your account's balance is ${displayBalance} after a withdrawal of $${response.transaction_amount}`,
  };

  return (
    <Grid
      container
      direction="column"
    >
      <Card elevation={10}>
        <Grid
          item
          margin={2}
        >
          <Typography variant="h2">
            Welcome to the Advisors Excel ATM
          </Typography>
        </Grid>
        <Grid item>
          <h2>
            {accountNumber
              ? `Your Account Number: 
         ${accountNumber}`
              : ""}
          </h2>
        </Grid>
        <Grid
          container
          direction="column"
          // spacing={2}
        >
          <Grid
            item
            padding={4}
          >
            <Form
              formInput={formInput}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
            />
          </Grid>
          <Grid
            item
            padding={4}
          >
            <Grid
              container
              direction="column"
            >
              <Grid item>
                <Paper elevation={4}>
                  <p>Response goes here:</p>
                  <p>
                    {response.transaction_type
                      ? displayMessage[response.transaction_type]
                      : null}
                  </p>
                  <div>
                    {response.allBalances &&
                      formInput.request_type == "" &&
                      response.allBalances?.map((account, i) => (
                        <p key={i}>
                          Your account number {account.account_number} has a new
                          balance of {formatBalance(account.balance)}
                        </p>
                      ))}
                  </div>
                </Paper>
              </Grid>
              <Grid item>
                <Paper elevation={4}>
                  <p>Error goes here: </p>
                  <span id="error">{error?.message || null}</span>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}

export default Home;
