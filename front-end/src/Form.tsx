import React from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

function Form({ formInput, handleChange, handleSubmit }) {
  const transactionOptions = {
    balanceInquiry: {
      displayName: "Balance Inquiry",
      showAmountField: false,
      buttonAction: "Get Balance",
    },
    deposit: {
      displayName: "Deposit",
      showAmountField: true,
      buttonAction: "Deposit",
    },
    withdrawal: {
      displayName: "Withdrawal",
      showAmountField: true,
      buttonAction: "Withdraw",
    },
  };

  return (
    <Box
      component="form"
      id="right over the form"
      onSubmit={handleSubmit}
    >
      <FormControl fullWidth>
        <Grid
          container
          direction="column"
          id="whole form container"
          justifyContent="center"
          rowSpacing={2}
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
            xs={6}
          >
            <Grid
              container
              justifyContent={"space-between"}
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
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={!formInput.request_type}
            >
              {transactionOptions[formInput.request_type]?.buttonAction ||
                "Submit"}
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    </Box>
  );
}

export default Form;
