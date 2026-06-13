import { useState } from "react"

const Income = ({ onAddIncome }) => {
  const [income, setIncome] = useState('')
  const [incomeName, setIncomeName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (income === '' || isNaN(Number(income))) return

    onAddIncome(incomeName, Number(income))

    setIncome('')
    setIncomeName('')
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={incomeName} onChange={(e) => setIncomeName(e.target.value)} type="text" placeholder="Income"/>
        <input value={income} onChange={(e) => setIncome(e.target.value)} type="number" placeholder="Income amount" />
        <button>Add income</button>
      </form>
    </div>
  )
}

export default Income