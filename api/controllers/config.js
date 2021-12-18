const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.get('/ajustes', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {

            res.render('config')
        } catch (err) {
            next(err)
        }
    })
}