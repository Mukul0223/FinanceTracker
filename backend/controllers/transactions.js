const transactionsRouter = require('express').Router()
const Transaction = require('../models/transaction')

// GET ALL TRANSACTION
transactionsRouter.get('/', (req, res) => {
  Transaction.find({}).then(transactions => res.json(transactions))
})

// GET A SINGLE TRANSACTION
transactionsRouter.get('/:id', (req, res, next) => {
  Transaction.findById(req.params.id).then(transaction => {
    if (transaction) {
      res.json(transaction)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

// POST
transactionsRouter.post('/', (req, res, next) => {
  const body = req.body

  const transaction = new Transaction({
    type: body.type,
    name: body.name,
    amount: body.amount
  })

  transaction.save().then(savedTransaction => res.status(201).json(savedTransaction)).catch(error => next(error))
})

// DELETE
transactionsRouter.delete('/:id', (req, res, next) => {
  Transaction.findByIdAndDelete(req.params.id).then(() => res.status(204).end()).catch(error => next(error))
})

// UPDATE TRANSACTION
transactionsRouter.put('/:id', (req, res, next) => {
  const { name, amount } = req.body
  Transaction.findById(req.params.id).then(transaction => {
    if (!transaction) {
      return res.status(404).end()
    }

    transaction.name = name
    transaction.amount = amount

    return transaction.save().then(updatedTransaction => res.json(updatedTransaction))
  })
    .catch(error => next(error))
})

module.exports = transactionsRouter