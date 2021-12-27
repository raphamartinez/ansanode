const Goal = require('../models/goal')
const GoalLine = require('../models/goalline')
const Sellers = require('../models/seller')
const moment = require('moment')
const multer = require('multer')
const multerConfig = require('../config/multer')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/metas', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            res.render('metas')
        } catch (err) {
            next(err)
        }
    })


    app.get('/goals', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_login = req.login.id_login

            const goals = await Goal.listGoalsByManager(id_login)
            res.json(goals)
        } catch (err) {
            next(err)
        }
    })

    app.get('/goal/sellers/:month/:office?/:seller?/:group?', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`goal/sellers/${req.params}`);

            if (cached) {
                return res.json(JSON.parse(cached));
            }

            let sellers;
            let offices;
            let id_login;
            let group;
            let month = req.params.month;
            if (req.access.all.allowed) {
                offices = req.params.office;
                id_login = req.params.seller;
                group = req.params.group;

                sellers = await Goal.listSeller(month, id_login, offices, group);
            } else {
                if (req.login.perfil == 4 || req.login.perfil == 8) {
                    id_login = req.params.seller;
                    group = req.params.group;

                    offices = req.params.office ? req.params.office : req.login.offices.map(of => of.code);

                    sellers = await Goal.listSeller(month, id_login, offices, group);
                } else {
                    id_login = req.login.id_login;
                    group = req.params.group;

                    sellers = await Goal.listSeller(month, id_login, false, group);
                }
            }

            cachelist.addCache(`goal/sellers/${req.params}`, JSON.stringify(sellers), 60 * 15);

            res.json(sellers);
        } catch (err) {
            next(err)
        }
    })

    app.get('/goal/offices/:month/:office', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`goal/offices/${req.params}`);

            // if (cached) {
            //     return res.json(JSON.parse(cached));
            // }

            let goals;
            let offices;
            let month = req.params.month;

            if (req.access.all.allowed) {
                offices = req.params.office;
                goals = await Goal.listOffice(month, offices);
            } else {
                offices = req.params.office ? req.params.office : req.login.offices.map(of => of.code);
                goals = await Goal.listOffice(month, offices);
            }

            cachelist.addCache(`goal/offices/${req.params}`, JSON.stringify(goals), 60 * 15);

            res.json(goals);
        } catch (err) {
            next(err)
        }
    })



    app.get('/goalsline/:id_salesman/:office/:group/:stock', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`goal:${JSON.stringify(req.params)}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_salesman = req.params.id_salesman
            const group = req.params.group
            const checkstock = req.params.stock
            const office = req.params.office

            const goalsline = await GoalLine.list(id_salesman, office, group, checkstock)
            cachelist.addCache(`goal:${JSON.stringify(req.params)}`, JSON.stringify(goalsline), 60 * 60 * 6)

            res.json(goalsline)
        } catch (err) {
            next(err)
        }
    })

    app.get('/goalslineexcel/:id_salesman/:groups', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            const groups = req.params.groups

            const wb = await GoalLine.listExcel(id_salesman, groups)

            wb.write('meta.xlsx', res)
        } catch (err) {
            next(err)
        }
    })


    app.post('/goal', [Middleware.authenticatedMiddleware, Authorization('goal', 'create')], async (req, res, next) => {
        try {
            const goal = req.body.goal

            await Goal.insert(goal)

            cachelist.delPrefix('goal')

            res.status(201).json({ msg: 'Meta agregada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.post('/goalexcel', [Middleware.authenticatedMiddleware, Authorization('goal', 'create')], multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const file = req.file

            await Goal.upload(file)

            cachelist.delPrefix('goal')

            res.json({ msg: 'Metas agregadas con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.put('/goal/:id_goal', [Middleware.authenticatedMiddleware, Authorization('goal', 'update')], async (req, res, next) => {
        try {
            const goal = req.body
            const id_goal = req.params.id_goal

            await Office.updateOffice(goal, id_goal)

            cachelist.delPrefix('goal')

            res.json({ msg: 'Meta actualizada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.delete('/goal/:id_goal', [Middleware.authenticatedMiddleware, Authorization('goal', 'delete')], async (req, res, next) => {
        try {
            const id_goal = req.params.id_goal

            await Goal.delete(id_goal)

            cachelist.delPrefix('goal')

            res.json({ msg: 'Meta eliminada con éxito.' })
        } catch (err) {
            next(err)
        }
    })

    app.get('/goalexpected/:id_salesman', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`goal:${JSON.stringify(req.params)}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_salesman = req.params.id_salesman

            const expected = await Sellers.listExpected(id_salesman)
            cachelist.addCache(`goal:${JSON.stringify(req.params)}`, JSON.stringify(expected), 60 * 60 * 6)

            res.json(expected)
        } catch (err) {
            next(err)
        }
    })

    app.get('/goalexpectedmonth/:id_salesman/:date', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            const cached = await cachelist.searchValue(`goal:${JSON.stringify(req.params)}`)

            if (cached) {
                return res.json(JSON.parse(cached))
            }

            const id_salesman = req.params.id_salesman
            let date = req.params.date

            date = moment(date).format("YYYY-MM-DD")

            const expected = await Sellers.listExpectedMonth(id_salesman, date)
            cachelist.addCache(`goal:${JSON.stringify(req.params)}`, JSON.stringify(expected), 60 * 60 * 6)

            res.json(expected)
        } catch (err) {
            next(err)
        }
    })
}