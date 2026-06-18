const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://84_db_user:${password}@ac-eawx8m6-shard-00-00.ufmboel.mongodb.net:27017,ac-eawx8m6-shard-00-01.ufmboel.mongodb.net:27017,ac-eawx8m6-shard-00-02.ufmboel.mongodb.net:27017/?ssl=true&replicaSet=atlas-s7hs0q-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const transactionSchema = new mongoose.Schema({
  type: String,
  name: String,
  amount: Number
})

const Transaction = mongoose.model('Transaction', transactionSchema)

const transaction = new Transaction({
  "type": "expense",
  "name": "Rent",
  "amount": 1100
})

transaction.save().then(result => {
  console.log('transaction saved!')
  mongoose.connection.close()
})