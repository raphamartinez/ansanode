const ProsegurUser = require('../models/proseguruser')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')

module.exports = app => {
    app.get('/sucursales', Middleware.authenticatedMiddleware, async ( req, res, next) => {
        try {
            res.render('sucursal');
        } catch (err) {
            next(err);
        }
    })

    app.get('/prosegur/users', Middleware.authenticatedMiddleware, async ( req, res, next) => {
        try {
            const users = await ProsegurUser.list();
            res.json(users);
        } catch (err) {
            next(err);
        }
    })

    app.get('/office/prosegur/:type/:start/:end/:offices', [Middleware.authenticatedMiddleware, Authorization('office', 'read')], async (req, res, next) => {
        try {
            let clocks

            const period = {
                start: req.params.start,
                end: req.params.end
            }
            const type = req.params.type
            let office = req.params.offices

            if (req.access.all.allowed) {
                clocks = await ProsegurUser.listProsegur(office, period, type)
            } else {
                if(!office) office = req.login.offices
                clocks = await ProsegurUser.listProsegur(office, period, type)
            }

            res.json(clocks)
        } catch (err) {
            next(err)
        }
    })


    app.get('/prosegur/order/:office', Middleware.authenticatedMiddleware, async ( req, res, next) => {
        try {
            const office = req.params.office;

            const users = await ProsegurUser.list(office);
            res.json(users);
        } catch (err) {
            next(err);
        }
    })

    app.post('/prosegur/user', Middleware.authenticatedMiddleware, async ( req, res, next) => {
        try {
            const user = req.body.user;

            const id = await ProsegurUser.insert(user);
            res.json({id, msg: `Usuario agregado con éxito.`});
        } catch (err) {
            next(err);
        }
    })

    app.delete('/prosegur/user/:id', Middleware.authenticatedMiddleware, async ( req, res, next) => {
        try {
            const id = req.params.id;

            await ProsegurUser.drop(id);
            res.json({id, msg: `Usuario eliminado con éxito.`});
        } catch (err) {
            next(err);
        }
    })
}