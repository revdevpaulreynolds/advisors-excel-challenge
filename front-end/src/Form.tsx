import React from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

function Form({ formInput, handleSubmit, handleChange }) {
  const transactionOptions = {
    balanceInquiry: { displayName: "Balance Inquiry", showAmountField: false },
    deposit: { displayName: "Deposit", showAmountField: true },
    withdrawal: { displayName: "Withdrawal", showAmountField: true },
  };

  return (
    <Grid
      container
      justifyContent="center"
      spacing={2}
      margin={2}
    >
      <Grid
        item
        xs={11}
        justifyContent="center"
        className="flex p-3 bg-white"
      >
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <Grid
              container
              direction="column"
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <InputLabel id="request-type-select">
                  Choose your transaction
                </InputLabel>
                <Select
                  fullWidth
                  labelId="request-type-select"
                  id="request_type"
                  label="Choose your transaction"
                  name="request_type"
                  value={formInput.request_type}
                  onChange={handleChange}
                >
                  {Object.keys(transactionOptions).map((transactionType, i) => (
                    <MenuItem
                      key={i}
                      value={transactionType}
                    >
                      {transactionOptions[transactionType].displayName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <Grid
                  container
                  spacing={
                    formInput.request_type !== "balanceInquiry" &&
                    formInput.request_type !== ""
                      ? 2
                      : 0
                  }
                >
                  <Grid item>
                    <TextField
                      id="account_number"
                      name="account_number"
                      label="Account Number"
                      required
                      onChange={handleChange}
                      value={formInput.account_number}
                    />
                  </Grid>
                  <Grid item>
                    {transactionOptions[formInput.request_type]
                      ?.showAmountField && (
                      <TextField
                        id="transaction_amount"
                        name="transaction_amount"
                        label={`${
                          transactionOptions[formInput.request_type].displayName
                        } Amount`}
                        value={formInput.transaction_amount || ""}
                        onChange={handleChange}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                justifyContent="flex-start"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={!formInput.request_type}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
}

export default Form;
