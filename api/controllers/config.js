const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.get('/ajustes', Middleware.authenticatedMiddleware, async (req, res, next) => {
        try {

            res.render('config', {
                perfil: req.login.perfil
            })
        } catch (err) {
            next(err)
        }
    })
}