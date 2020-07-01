const router = require('../routes')
const handler = require('../handlers/home')

module.exports = (app) => {
    app.use('/', router.home)
    app.use('/home', router.home)

    app.use('/user', router.users)

    app.use('/play', router.plays)

    app.use('*', handler.get.notFound);
}