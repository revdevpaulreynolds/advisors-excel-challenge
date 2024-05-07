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
import Paper from "@mui/material/Paper";

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
      onSubmit={handleSubmit}
    >
      <Grid
        item
        padding={2}
      >
        <Paper elevation={4}>
          <FormControl fullWidth>
            <Grid
              container
              direction="column"
              justifyContent="center"
              rowSpacing={2}
              padding={2}
            >
              <Grid item>
                <Grid container>
                  <Grid
                    item
                    xs
                  />
                  <Grid
                    item
                    xs={6}
                  >
                    <FormControl fullWidth>
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
                        {Object.keys(transactionOptions).map(
                          (transactionType, i) => (
                            <MenuItem
                              key={i}
                              value={transactionType}
                            >
                              {transactionOptions[transactionType].displayName}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs
                  />
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  justifyContent={"space-between"}
                  spacing={2}
                >
                  <Grid
                    item
                    xs={3}
                  />
                  <Grid
                    item
                    xs={3}
                  >
                    <TextField
                      id="account_number"
                      name="account_number"
                      label="Account Number"
                      required
                      onChange={handleChange}
                      value={formInput.account_number}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                  >
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
                        required
                      />
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={3}
                  />
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  justifyContent={"flex-end"}
                >
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      disabled={!formInput.request_type}
                    >
                      {transactionOptions[formInput.request_type]
                        ?.buttonAction || "Submit"}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormControl>
        </Paper>
      </Grid>
    </Box>
  );
}

export default Form;
