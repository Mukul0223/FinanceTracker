const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Transaction = require('../models/transaction')

const api = supertest(app)

describe('when there is inititally some transactions saved', () => {
  beforeEach(async () => {
    await Transaction.deleteMany({})
    await Transaction.insertMany(helper.initialTransactions)
  })

  test('transactions are returned as json', async () => {
    await api
      .get('/api/transactions')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all transactions are returned', async () => {
    const response = await api.get('/api/transactions')

    assert.strictEqual(response.body.length, helper.initialTransactions.length)
  })

  test('a specific note is within the returned transactions', async () => {
    const response = await api.get('/api/transactions')

    const contents = response.body.map(e => e.name)
    assert(contents.includes('Rent'))
  })

  describe('viewing a specific transaction', async () => {
    test('succeeds with a valid id', async () => {
      const transactionsAtStart = await helper.transactionsInDb()
      const transactionToView = transactionsAtStart[0]

      const resultTransaction = await api
        .get(`/api/transactions/${transactionToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultTransaction.body, transactionToView)
    })

    test('fails with status code 404 if note does not exit', async () => {
      const validNonexistingId = await helper.nonExisitingId()

      await api.get(`/api/transactions/${validNonexistingId}`).expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/transactions/${invalidId}`).expect(400)
    })
  })

  describe('addition of new transaction', async () => {
    test('succeeds with valid data', async () => {
      const newTransaction = {
        type: 'income',
        name: 'fishing',
        amount: 125.65
      }

      await api
        .post('/api/transactions')
        .send(newTransaction)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const transactionsAtEnd = await helper.transactionsInDb()
      assert.strictEqual(transactionsAtEnd.length, helper.initialTransactions.length + 1)

      const contents = transactionsAtEnd.map(t => t.name)
      assert(contents.includes('fishing'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newTransaction = { type: 'income' }

      await api.post('/api/transactions').send(newTransaction).expect(400)

      const transactionsAtEnd = await helper.transactionsInDb()

      assert.strictEqual(transactionsAtEnd.length, helper.initialTransactions.length)
    })
  })

  describe.only('deletion of a transaction', async () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const transactionsAtStart = await helper.transactionsInDb()
      const transactionToDelete = transactionsAtStart[0]

      await api.delete(`/api/transactions/${transactionToDelete.id}`).expect(204)

      const transactionAtEnd = await helper.transactionsInDb()
      const ids = transactionAtEnd.map(t => t.id)
      assert(!ids.includes(transactionToDelete.id))

      assert.strictEqual(transactionAtEnd.length, helper.initialTransactions.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})