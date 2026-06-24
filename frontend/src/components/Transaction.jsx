import { useState } from "react";

const Transaction = ({ onAddAmount }) => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('expense')

  const handleSubmit = (e) => {
    e.preventDefault()

    if ((description === '') || (amount === '' || isNaN(amount))) return

    onAddAmount(description, Number(amount), category)

    setDescription('')
    setAmount('')
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={description} placeholder="description" onChange={(e) => setDescription(e.target.value)}/>
        <input type="text" value={amount} placeholder="amount" onChange={(e) => setAmount(e.target.value)} />
        <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" style={{marginLeft: '5px'}}>Add</button>
      </form>
    </div>
  )
}

export default Transaction