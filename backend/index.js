const express = require('express')
const app = express()

let transactions = [
  {
    "id": "1",
    "type": "income",
    "name": "Paycheck",
    "amount": 2500
  },
  {
    "id": "2",
    "type": "expense",
    "name": "Groceries",
    "amount": 120
  },
  {
    "id": "3",
    "type": "expense",
    "name": "Rent",
    "amount": 1100
  },
  {
    "id": "4",
    "type": "income",
    "name": "Freelance Design",
    "amount": 450
  },
  {
    "id": "5",
    "type": "expense",
    "name": "Streaming Subscription",
    "amount": 15
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(express.json())

app.get('/', (request, response) => {
  const now = new Date().toLocaleString()
  response.send(`<h1>Hello world! ${now}</h1>`)
})

app.get('/api/transactions', (request, response) => {
  response.json(transactions)
})

app.get('/api/transactions/:id', (request, response) => {
  const id = request.params.id
  const transaction = transactions.find(t => t.id === id)

  if (transaction) {
    response.json(transaction)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/transactions/:id', (request, response) => {
  const id = request.params.id
  transactions = transactions.filter(t => t.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = transactions.length > 0 ? Math.max(...transactions.map(t => Number(t.id))) : 0

  return String(maxId + 1)
}

app.post('/api/transactions', (request, response) => {
  const body = request.body

  if (!body.amount || isNaN(body.amount)) {
    return response.status(400).json({ error: 'amount missing' })
  }

  if (!body.name) {
    return response.status(400).json({ error: 'description/name missing' })
  }

  const transaction = {
    id: generateId(),
    type: body.type,
    name: body.name,
    amount: Number(body.amount)
  }

  transactions = transactions.concat(transaction)

  response.json(transaction)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})