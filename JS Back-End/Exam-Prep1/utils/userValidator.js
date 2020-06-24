const { body } = require('express-validator')

module.exports = [
    body('email', 'Email should be valid!')
    .isEmail(),

    body('password')
    .isLength({ min: 6 })
    .withMessage('Password is required and need to be at least 6 characters.')
]