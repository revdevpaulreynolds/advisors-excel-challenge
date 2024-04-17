import { useState } from "react";
import {PropTypes} from 'prop-types';
import { getBalance, makeDeposit, makeWithdrawal } from "./utils/api";

function Home({
  initialState = {
    account_number: '',
    transaction_amount: 0,
    request_type: 'balanceInquiry'
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
            setResponse(res.balance).then(console.log(response))
          }).catch(err => {
            console.log(`error in handlesubmit: ${error}`)
            setError(err)
          })
        break;
      case 'deposit':
        await makeDeposit(request.account_number, ac.signal)
          .then(res => {
            setResponse(res)
          }).catch(setError)
        break;
      case 'withdrawal':
        await makeWithdrawal(request.account_number, ac.signal)
          .then(setResponse).catch(setError)
    }
    return () => ac.abort();
  }

  const changeHandler = async ({target: {name, value}}) => {
    await setRequest(prevState => ({...prevState, [name]: value}))
  }

  return (
    <>
    <h1>Hello!</h1>
    <form onSubmit={handleSubmit}>
      <input type="text" id="account_number" name="account_number" value={request.account_number} required placeholder="Account Number" onChange={changeHandler} />
      <input type="text" id="transaction_amount" name="transaction_amount" value={request.transaction_amount || ''} placeholder="Transaction Amount" onChange={changeHandler} />
      <input type='submit' />
    </form>
    <p>{`${request.account_number}, ${request.transaction_amount}, ${request.request_type}`}</p>
    <p>{response ? response : `Nothin' yet`}</p>
    <p>{error ? JSON.stringify(error) : 'Lucky you, no errors'}</p>
    </>
  )
}

Home.propTypes = {
  initialState: PropTypes.object
}

export default Home;
