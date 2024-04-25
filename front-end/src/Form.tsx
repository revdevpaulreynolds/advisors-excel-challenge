import React from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';

function Form ({request, handleSubmit, handleChange}) {

  const transactionOptions = {
    balanceInquiry: {displayName: 'Balance Inquiry', showAmountField: false},
    deposit: {displayName: 'Deposit', showAmountField: true},
    withdrawal: {displayName: 'Withdrawal', showAmountField: true},
  }

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel id="request-type-select">Choose your transaction</InputLabel>
          <Select labelId="request-type-select" id="request_type" label='Choose your transaction' name='request_type' value={request.request_type} onChange={handleChange}>
          {Object.keys(transactionOptions).map((transactionType, i) => (
              <MenuItem key={i} value={transactionType}>
                {transactionOptions[transactionType].displayName}
              </MenuItem>
            ))}
          </Select>
          <div className="flex justify-between">


          <TextField 
            id="account_number" 
            name="account_number" 
            label="Account Number"
            required 
            onChange={handleChange}
            value={request.account_number}
          />
          {transactionOptions[request.request_type]?.showAmountField && (
            <TextField 
            id="transaction_amount" 
            name="transaction_amount" 
            label={`${transactionOptions[request.request_type].displayName} Amount`}
            value={request.transaction_amount || ''} 
            onChange={handleChange} />
          )}
          </div>
          <Button type="submit" variant="contained" color="success" disabled={!request.request_type}>Submit</Button>
        </FormControl>
      </form>
    </div>
  )
}

export default Form;