const router = require('express').Router()
const handler = require('../handlers/users')
const isAuth = require('../utils/isAuth')
const validations = require('../utils/userValidator')

router.get('/login', handler.get.login)
router.get('/register', handler.get.register)
router.get('/logout', isAuth(), handler.get.logout)
router.get('/info', isAuth(), handler.get.info)

router.post('/login', validations, handler.post.login)
router.post('/register', validations, handler.post.register)
router.post('/increase', isAuth(), handler.post.increase)

module.exports = router