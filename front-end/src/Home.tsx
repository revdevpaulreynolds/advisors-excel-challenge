import React, { useState } from "react";
import { getBalance, makeDeposit, makeWithdrawal } from "./utils/api";
import Form from './Form'

type Request = {
  account_number: number | null,
  transaction_amount: number,
  request_type: string,
}

type Response = {
  account_number?: number,
  balance?: number,
  allBalances?: Response[],
  transaction_type?: string,
  transaction_amount?: number
}

type Error = {
  message?: string
}

function Home({
  initialState = {
    account_number: null,
    transaction_amount: 0,
    request_type: ''
  },
}) {
  const [request, setRequest] = useState<Request>(initialState);
  const [response, setResponse] = useState<Response>({});
  const [error, setError] = useState<Error>({});
  const [accountNumber, setAccountNumber] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [allBalanceInquiry, setAllBalanceInquiry] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setResponse({})
    setError({})
    const ac = new AbortController();
    
    const responseSetter = (apiResponse: Response) => {
      setResponse(apiResponse),
      apiResponse.account_number && setAccountNumber(apiResponse.account_number)
      setBalance(apiResponse.balance || null)
      apiResponse.allBalances && setAllBalanceInquiry(true);
    }

    switch (request.request_type) {
      case 'balanceInquiry':
        await getBalance(request.account_number, ac.signal)
        .then(res => {
          responseSetter(res)
          console.log(`Response in component's API call: ${JSON.stringify(res)}`)
          }).catch(err => {
            console.log(`error in handlesubmit: ${err}`)
            setError(err)
          })
          break;
          case 'deposit':
            await makeDeposit(request.account_number, request.transaction_amount, ac.signal)
            .then(res => {
            console.log(`Response in component's API call: ${JSON.stringify(res)}`)
            setResponse(res)
          }).catch(setError)
          break;
          case 'withdrawal':
            await makeWithdrawal(request.account_number, request.transaction_amount, ac.signal)
            .then(res => {
              console.log(`Response in component's API call: ${JSON.stringify(res)}`)
              setResponse(res)
            }).catch(setError)
          }
    setRequest({...initialState, account_number: accountNumber})
    return () => ac.abort();
  }

  const handleChange = ({target: {name, value}}) => {
    setRequest(prevState => ({...prevState, [name]: value}))
  }

  const displayMessage = {
    balanceInquiry: `Your account's balance is $${balance}`,
    deposit: `Your account's balance is ${(balance && balance < 0 && '-')}$${balance} after a deposit of $${response.transaction_amount && response.transaction_amount}`,
    withdrawal: `Your account's balance is ${(balance && balance < 0 && '-')}$${balance} after a withdrawal of $${response.transaction_amount}`
  }

  return (
    <>
    <h1>Welcome to Advisors Excel ATM!</h1>
    {accountNumber && <h2>Account Number: {accountNumber}</h2>}
      <Form request={request} handleSubmit={handleSubmit} handleChange={handleChange}/>
    <p>{response.transaction_type ? displayMessage[response.transaction_type] : null}</p>
    <div>
      {allBalanceInquiry && response.allBalances?.map((account, i) => (
        <p key={i}>Your account number {account.account_number} has a new balance of ${account.balance}</p>
      ))}
    </div>
    <p>{error?.message || null}</p>
    </>
  )
}

export default Home;

