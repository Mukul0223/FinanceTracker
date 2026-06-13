import { useState, useEffect } from "react"
import Income from "./components/Income"
import Expense from "./components/Expense"
import transactionService from "./services/transaction"
import History from "./components/History"

const App = () => {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    transactionService.getAll().then(initialTransactions => {
      setTransactions(initialTransactions)
    })
  }, [])

  const balance = transactions.reduce((total, transaction) => {
    if (transaction.type === 'income') {
      return total + transaction.amount
    } else {
      return total - transaction.amount
    }
  }, 0)

  const handleExpense = (name, amount) => {
    const newTransaction = {
      type: 'expense',
      name: name,
      amount: amount
    }
    transactionService
      .create(newTransaction)
      .then(returnedTransaction => {
        setTransactions(transactions.concat(returnedTransaction))
      })
  }
  
  const handleIncome = (name, amount) => {
    const newTransaction = {
      type: 'income',
      name: name,
      amount: amount
    }

    transactionService
      .create(newTransaction)
      .then(returnedTransaction => {
        setTransactions(transactions.concat(returnedTransaction))
      })
  }
  
  return (
    <div>
      <h1>Finance Tracker</h1>
      
      {/* Balance display */}
      <h3 style={{ color: balance >= 0 ? 'green' : 'red' }}>Balance: ${balance}</h3>

      <div>
        {/* Expense */}
        <div>
          <Expense onAddExpense={handleExpense}/>
        </div>

        {/* Income */}
        <div style={{ marginTop: '10px' }}>
          <Income onAddIncome={handleIncome} />
        </div>
      </div>

      {/* History List! */}
      <h4>History</h4>
      <History transactions={transactions} />
    </div>
  )
}

export default App