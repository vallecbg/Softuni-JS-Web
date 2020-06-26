const router = require('express').Router()
const handler = require('../handlers/expenses')
const isAuth = require('../utils/isAuth')
const validations = require('../utils/expenseValidator')

router.get('/new-expense', isAuth(), handler.get.newExpense)
router.get('/report/:id', isAuth(), handler.get.report)
router.get('/stop-tracking/:id', isAuth(), handler.get.stopTracking)

router.post('/new-expense', isAuth(), validations, handler.post.newExpense)

module.exports = router