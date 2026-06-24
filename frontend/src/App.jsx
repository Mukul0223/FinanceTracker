import { useState, useEffect } from "react"
import transactionService from "./services/transaction"
import History from "./components/History"
import Transaction from "./components/Transaction"
import Login from "./components/Login"
import Notification from "./components/Notification"
import './App.css'

const App = () => {
  const [transactions, setTransactions] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      transactionService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      transactionService.getAll().then(initialTransactions => {
        setTransactions(initialTransactions)
      })
    } else {
      setTransactions([])
    }
  }, [user])

  const balance = transactions.reduce((total, transaction) => {
    if (transaction.type === 'income') {
      return total + transaction.amount
    } else {
      return total - transaction.amount
    }
  }, 0)

  const handleTransaction = (name, amount, type) => {
    const newTransaction = {
      name: name,
      amount: Number(amount),
      type: type
    }
    transactionService.create(newTransaction).then(returnedTransaction => {
      setTransactions(transactions.concat(returnedTransaction))
    })
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedAppUser')
    setUser(null)
  }

  
  return (
    <div>
      <h1>Finance Tracker</h1>
      <Notification message={errorMessage} />
      {!user && <Login setErrorMessage={setErrorMessage} setUser={setUser} />}

      {user && (
        <>
          <p>{user.name} logged in</p>
          <button onClick={handleLogOut}>log out</button>
          <h3 style={{ color: balance >= 0 ? 'green' : 'red' }}>Balance: ${balance}</h3>
          <div>
            <Transaction onAddAmount={handleTransaction}/>
          </div>
          <div>
            <h4>History</h4>
            <History transactions={transactions} />
          </div>
        </>
      )}
    </div>
  )
}

export default App