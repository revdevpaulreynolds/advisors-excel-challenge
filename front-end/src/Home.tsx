import { useState } from "react";
import PropTypes from 'prop-types';
import { getBalance, makeDeposit, makeWithdrawal } from "./utils/api";
import React from "react";

type Request = {
  account_number: string,
  transaction_amount: number,
  request_type: string,
}

type Response = {
  account_number?: number | null,
  balance?: number | null,
  allBalances?: Response[] | null
}

type Error = {
  message?: string | null
}

function Home({
  initialState = {
    account_number: '',
    transaction_amount: 0,
    request_type: ''
  },
}) {
  const [request, setRequest] = useState<Request>(initialState);
  const [response, setResponse] = useState<Response>({});
  const [error, setError] = useState<Error>({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResponse({account_number: null, balance: null})
    setError({message: null})
    const ac = new AbortController();
    switch (request.request_type) {
      case 'balanceInquiry':
        await getBalance(request.account_number, ac.signal)
          .then(res => {
            console.log(`res in handlesubmit: ${JSON.stringify(res)}`)
            setResponse(res)
            console.log(`Response in component's API call: ${JSON.stringify(response)}`)
          }).catch(err => {
            console.log(`error in handlesubmit: ${err}`)
            setError(err)
          })
        break;
      case 'deposit':
        await makeDeposit(request.account_number, request.transaction_amount, ac.signal)
          .then(res => {
            setResponse(res)
          }).catch(setError)
        break;
      case 'withdrawal':
        await makeWithdrawal(request.account_number, request.transaction_amount, ac.signal)
          .then(setResponse).catch(setError)
    }
    return () => ac.abort();
  }

  const changeHandler = ({target: {name, value}}) => {
    setRequest(prevState => ({...prevState, [name]: value}))
  }

  const transactionOptions = {
    balanceInquiry: {displayName: 'Balance Inquiry', showAmountField: false},
    deposit: {displayName: 'Deposit', showAmountField: true},
    withdrawal: {displayName: 'Withdrawal', showAmountField: true},
  }

  return (
    <>
    <h1>Welcome to Advisors Excel ATM!</h1>
    <form onSubmit={handleSubmit}>
    <select name="request_type" id="request_type" onChange={changeHandler}>
      <option value="">--Choose your Transaction--</option>
      {Object.keys(transactionOptions).map((transactionType, i) => (
        <option key={i} value={transactionType}>
          {transactionOptions[transactionType].displayName}
        </option>
      ))}
    </select>
    <input type="text" id="account_number" name="account_number" value={request.account_number} required placeholder="Account Number" onChange={changeHandler} />
    {transactionOptions[request.request_type]?.showAmountField && <input type="text" id="transaction_amount" name="transaction_amount" value={request.transaction_amount || ''} placeholder="Transaction Amount" onChange={changeHandler} />}
    <div>
      <input type='submit' disabled={!request.request_type}/>
    </div>
    </form>
    <p>{`${request.account_number}, ${request.transaction_amount}, ${request.request_type}`}</p>
    <p>{response?.account_number ? `Your account number ${response.account_number} has a new balance of $${response.balance}` : `No good response yet`}</p>
    <div>
      {response?.allBalances && response.allBalances.map((account, i) => (
        <p key={i}>Your account number {account.account_number} has a new balance of ${account.balance}</p>
      ))}
    </div>
    <p>{error?.message || 'Lucky you, no errors'}</p>
    </>
  )
}

Home.propTypes = {
  initialState: PropTypes.object
}

export default Home;

