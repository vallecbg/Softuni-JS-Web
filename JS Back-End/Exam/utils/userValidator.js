const { body } = require('express-validator')

module.exports = [
    body('username', 'Username should be at least 3 characters long and consist only english letters and digits!')
    .isLength({min: 3})
    .matches(/^[A-Za-z0-9]+$/),

    body('password', 'Password should be at least 3 characters long and consist only english letters and digits!')
    .isLength({min: 3})
    .matches(/^[A-Za-z0-9]+$/)
]