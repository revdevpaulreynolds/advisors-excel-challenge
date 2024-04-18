import React from "react";
import {Button, FormControl} from '@mui/material';

function Form ({request, handleSubmit, handleChange}) {

  const transactionOptions = {
    balanceInquiry: {displayName: 'Balance Inquiry', showAmountField: false},
    deposit: {displayName: 'Deposit', showAmountField: true},
    withdrawal: {displayName: 'Withdrawal', showAmountField: true},
  }

  return (
    <>
      <FormControl>
        <Button>Submit</Button>
      </FormControl>
      <form onSubmit={handleSubmit}>
        <select name="request_type" id="request_type" onChange={handleChange}>
          <option value="">--Choose your Transaction--</option>
          {Object.keys(transactionOptions).map((transactionType, i) => (
            <option key={i} value={transactionType}>
              {transactionOptions[transactionType].displayName}
            </option>
          ))}
        </select>
        <input 
          type="text" 
          id="account_number" 
          name="account_number" 
          value={request.account_number} 
          required placeholder="Account Number" 
          onChange={handleChange} 
        />
        {transactionOptions[request.request_type]?.showAmountField && (
          <input 
            type="text" 
            id="transaction_amount" 
            name="transaction_amount" 
            value={request.transaction_amount || ''} 
            placeholder="Transaction Amount" 
            onChange={handleChange} />
        )}
        <div>
          <input type='submit' disabled={!request.request_type}/>
        </div>
      </form>
    </>
  )
}

export default Form;