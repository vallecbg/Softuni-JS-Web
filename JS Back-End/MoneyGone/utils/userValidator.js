const { body } = require('express-validator')

module.exports = [
    body('username', 'Username should be at least 4 characters long and consist only english letters and digits!')
    .isLength({min: 4})
    .matches(/^[A-Za-z0-9]+$/),

    body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and need to be at least 8 characters.')
]