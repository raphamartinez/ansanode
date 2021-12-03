const WebScraping = require('../models/webscraping')
const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {
    app.get('/seguridad', Middleware.authenticatedMiddleware, async ( req, res, next) => {
        try {
            await WebScraping.init()
            const dateReg = await WebScraping.listWebscrapingHistory()
            res.status(200).json(dateReg)
        } catch (err) {
            next(err)
        }
    })

    app.get('/seguridadhistory', Middleware.authenticatedMiddleware, async ( req, res, next) => {
        try {
            const dateReg = await WebScraping.listWebscrapingHistory()
            res.status(200).json(dateReg)
        } catch (err) {
            next(err)
        }
    })
}