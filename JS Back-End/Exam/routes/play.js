const router = require('express').Router()
const handler = require('../handlers/plays')
const homeHandler = require('../handlers/home')
const isAuth = require('../utils/isAuth')

router.get('/create', isAuth(), handler.get.newPlay)
router.get('/details/:id', isAuth(), handler.get.details)
router.get('/like/:id', isAuth(), handler.get.likePlay)
router.get('/edit/:id', isAuth(), handler.get.editPlay)
router.get('/delete/:id', isAuth(), handler.get.deletePlay)
router.get('/mostLikes', isAuth(), homeHandler.get.sortByLikes)
router.get('/mostDate', isAuth(), homeHandler.get.sortByDate)

//TODO: validations!!!
// , validations, 

router.post('/create', isAuth(), handler.post.newPlay)
router.post('/edit/:id', isAuth(), handler.post.editPlay)

module.exports = router