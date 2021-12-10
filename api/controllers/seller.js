const Hbs = require('../models/hbs')
const Seller = require('../models/seller')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/sellershbs', [Middleware.authenticatedMiddleware, Authorization('salesman', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`sellers`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const sellers = await Hbs.listSalesman()
            cachelist.addCache(`sellershbs`, JSON.stringify(sellers), 60 * 60 * 6)

            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellers', [Middleware.authenticatedMiddleware, Authorization('salesman', 'read')], async (req, res, next) => {
        try {
            const sellers = await Seller.list()
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellers/goal', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            let id_login = false;
            let office = false;
            let sellers;

            const cached = await cachelist.searchValue(`goal:sellers:goal:${req.login.id_login}`)
            if (cached) {
                return res.json(JSON.parse(cached))
            }

            if (req.access.all.allowed) {
                sellers = await Seller.list(id_login, office)
            } else {
                if (req.login.perfil == 4 || req.login.perfil == 8) {
                    let offices = req.login.offices

                        office = offices.map(of => {
                            return of.code
                        })
                 }else{
                    id_login = req.login.id_login
                 }
                 sellers = await Seller.list(id_login, office)
            }

            cachelist.addCache(`goal:sellers:goal:${req.login.id_login}`, JSON.stringify(sellers), 60 * 60 * 6)

            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.get('/sellers/dashboard', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            let id_login = false;
            let office = false;
            let code = false;

            let sellers;
            let expected;

            const cached = await cachelist.searchValue(`goal:sellers:${req.login.id_login}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            if (req.access.all.allowed) {
                sellers = await Seller.dashboard(id_login, office, code)
                sellers = await Seller.listExpected(id_login, office, code)

            } else {
                if (req.login.perfil == 4) {
                    office = req.login.offices
                } else {
                    id_login = req.login.id_login
                }
                sellers = await Seller.dashboard(id_login)
            }

            cachelist.addCache(`goal:sellers:${req.login.id_login}`, JSON.stringify(sellers), 60 * 60 * 6)

            res.json(sellers)

        } catch (err) {
            next(err)
        }
    })

    app.get('/sellergoal/:id_salesman', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            const id_login = req.login.id_login

            const sellers = await Seller.view(id_login, id_salesman)
            res.json(sellers)
        } catch (err) {
            next(err)
        }
    })

    app.post('/salesman', [Middleware.authenticatedMiddleware, Authorization('salesman', 'create')], async (req, res, next) => {
        try {
            const sellers = req.body.sellers;

            const newSellers = await Seller.insert(sellers);

            cachelist.delPrefix('sellers');

            res.status(201).json({ msg: 'Vendedor agregado con éxito.', sellers: newSellers })
        } catch (err) {
            next(err)
        }
    })

    app.put('/salesman/:id_salesman', [Middleware.authenticatedMiddleware, Authorization('salesman', 'update')], async (req, res, next) => {
        try {
            const manager = req.body.manager
            await Seller.update(manager)

            cachelist.delPrefix('sellers')

            res.json({ msg: 'Vendedor actualizado con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/salesman/:id_salesman', [Middleware.authenticatedMiddleware, Authorization('salesman', 'delete')], async (req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            await Seller.delete(id_salesman)

            cachelist.delPrefix('sellers')

            res.json({ msg: 'Vendedor eliminado con éxito.' })
        } catch (err) {
            next(err)
        }
    })
}