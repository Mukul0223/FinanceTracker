const transactionsRouter = require('express').Router()
const Transaction = require('../models/transaction')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// GET ALL TRANSACTION
transactionsRouter.get('/', async (req, res) => {
  const transactions = await Transaction.find({})
  res.json(transactions)
})

// GET A SINGLE TRANSACTION
transactionsRouter.get('/:id', async(req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (transaction) {
    res.json(transaction)
  } else {
    res.status(404).end()
  }
})

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// POST
transactionsRouter.post('/', async(req, res) => {
  const body = req.body
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid' })
  }

  const transaction = new Transaction({
    type: body.type,
    name: body.name,
    amount: body.amount,
    user: user._id
  })

  const savedTransaction = await transaction.save()
  user.transactions = user.transactions.concat(savedTransaction._id)
  await user.save()

  res.status(201).json(savedTransaction)
})

// DELETE
transactionsRouter.delete('/:id', async(req, res) => {
  await Transaction.findByIdAndDelete(req.params.id)
  res.status(204).end()
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