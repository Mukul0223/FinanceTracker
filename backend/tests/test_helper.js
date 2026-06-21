const Transaction = require('../models/transaction')
const User = require('../models/user')

const initialTransactions = [
  {
    type: 'income',
    name: 'Paycheck',
    amount: 2500
  },
  {
    type: 'expense',
    name: 'Rent',
    amount: 1100
  }
]

const nonExisitingId = async () => {
  const transaction = new Transaction({
    type: 'expense',
    name: 'fancy coffee',
    amount: 6.25
  })
  await transaction.save()
  await transaction.deleteOne()

  return transaction._id.toString()
}

const transactionsInDb = async () => {
  const transactions = await Transaction.find({})
  return transactions.map(t => t.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialTransactions,
  nonExisitingId,
  transactionsInDb,
  usersInDb
}