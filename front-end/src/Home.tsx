import React, { useState } from "react";
import { getBalance, makeDeposit, makeWithdrawal } from "./utils/api";
import Form from './Form'

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
  const [accountNumber, setAccountNumber] = useState('')
  const [balance, setBalance] = useState(null)

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setResponse({})
    setError({})
    const ac = new AbortController();
    switch (request.request_type) {
      case 'balanceInquiry':
        await getBalance(request.account_number, ac.signal)
          .then(res => {
            setResponse(res)
            setAccountNumber(res.account_number)
            setBalance(res.balance)
            console.log(`Response in component's API call: ${JSON.stringify(response)}`)
          }).catch(err => {
            console.log(`error in handlesubmit: ${err}`)
            setError(err)
          })
        break;
      case 'deposit':
        await makeDeposit(request.account_number, request.transaction_amount, ac.signal)
          .then(setResponse).catch(setError)
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

  return (
    <>
    <h1>Welcome to Advisors Excel ATM!</h1>
    {accountNumber && <h2>Account Number: {accountNumber}</h2>}
      <Form request={request} handleSubmit={handleSubmit} handleChange={changeHandler}/>
    <p>{`${request.account_number}, ${request.transaction_amount}, ${request.request_type}`}</p>
    <p>{balance ? `Your account number ${accountNumber} has a new balance of $${balance}` : null}</p>
    <div>
      {response?.allBalances && response.allBalances.map((account, i) => (
        <p key={i}>Your account number {account.account_number} has a new balance of ${account.balance}</p>
      ))}
    </div>
    <p>{error?.message || 'Lucky you, no errors'}</p>
    </>
  )
}

export default Home;

