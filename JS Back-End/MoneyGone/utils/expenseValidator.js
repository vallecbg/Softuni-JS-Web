const { body } = require('express-validator')

module.exports = [
    body('merchant', 'Merchant should be at least 4 characters long')
    .isLength({min: 4}),

    body('total', 'Total should be positive number')
    .isFloat({min: 0}),

    body('description', 'Description should be minimum 10 characters long and 50 characters maximum')
    .isLength({min: 10, max: 50})
]