const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to Mongodb')
  })
  .catch(error => {
    console.log('error connecting to Mongodb:', error.message)
  })

const transactionSchema = new mongoose.Schema({
  type: String,
  name: String,
  amount: Number,
})

transactionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Transaction', transactionSchema)