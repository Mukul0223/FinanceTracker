import { useState } from "react"

const Expense = ({ onAddExpense }) => {
  const [expense, setExpense] = useState('')
  const [expenseName, setExpenseName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (expense === '' || isNaN(Number(expense))) return

    onAddExpense(expenseName, Number(expense))

    setExpense('')
    setExpenseName('')
  } 
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={expenseName} onChange={(e) => setExpenseName(e.target.value)} type="text" placeholder="Expense"/>
        <input value={expense} onChange={(e) => setExpense(e.target.value)} type="number" placeholder="Expense amount" />
        <button type="submit">Add expense</button>
      </form>
    </div>
  )
}
export default Expense