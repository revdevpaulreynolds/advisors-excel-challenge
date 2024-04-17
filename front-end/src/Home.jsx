import { useState } from "react";
import {PropTypes} from 'prop-types';
import { getBalance, makeDeposit, makeWithdrawal } from "./utils/api";

function Home({
  initialState = {
    account_number: '',
    transaction_amount: 0,
    request_type: ''
  },
}) {
  const [request, setRequest] = useState(initialState);
  const [response, setResponse] = useState();
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    setResponse()
    e.preventDefault();
    e.stopPropagation();
    const ac = new AbortController();
    switch (request.request_type) {
      case 'balanceInquiry':
        getBalance(request.account_number, ac.signal)
          .then(res => {
            console.log(`res in handlesubmit: ${JSON.stringify(res)}`)
            setResponse(res.balance).then(console.log(`Response in component's API call: ${response}}`))
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

  const changeHandler = async ({target: {name, value}}) => {
    await setRequest(prevState => ({...prevState, [name]: value}))
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
    <p>{response?.message ||`No good response yet`}</p>
    <p>{response && `Your account number ${response.account_number} has a new balance of ${response.balance}`}</p>
    <p>{error?.message || 'Lucky you, no errors'}</p>
    </>
  )
}

Home.propTypes = {
  initialState: PropTypes.object
}

export default Home;

