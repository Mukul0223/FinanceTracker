require('dotenv').config()
const express = require('express')
const Transaction = require('./models/transaction')

const app = express()

let transactions = []

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)

// HOME
app.get('/', (request, response) => {
  const now = new Date().toLocaleString()
  response.send(`<h1>Hello world! ${now}</h1>`)
})

// GET ALL
app.get('/api/transactions', (request, response) => {
  Transaction.find({}).then(transactions => {
    response.json(transactions)
  })
    .catch(error => {
      console.log(error)
      response.status(500).end()
  })
})

// GET ID
app.get('/api/transactions/:id', (request, response, next) => {
  Transaction.findById(request.params.id)
    .then(transaction => {
      if (transaction) {
        response.json(transaction)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE
app.delete('/api/transactions/:id', (request, response, next) => {
  Transaction.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

// POST 
app.post('/api/transactions', (request, response) => {
  const body = request.body

  if (!body.amount || isNaN(body.amount)) {
    return response.status(400).json({ error: 'amount missing' })
  }

  if (!body.name) {
    return response.status(400).json({ error: 'description/name missing' })
  }

  const transaction = new Transaction({
    type: body.type,
    name: body.name,
    amount: Number(body.amount)
  })

  transaction.save().then((savedTransaction) => {
    response.json(savedTransaction)
  })
})

app.put('/api/transactions/:id', (request, response, next) => {
  const { name, amount } = request.body

  Transaction.findById(request.params.id).then(transaction => {
    if (!transaction) {
      return response.status(404).end()
    }
    transaction.name = name
    transaction.amount = amount

    return transaction.save().then((updatedTransaction) => {
      response.json(updatedTransaction)
    })
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CasrError') {
    return response.status(400).send({ error: 'malformatted id '})
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})