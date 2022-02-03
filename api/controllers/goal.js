const Goal = require('../models/goal')
const GoalLine = require('../models/goalline')
const Sellers = require('../models/seller')
const Office = require('../models/office')
const moment = require('moment')
const multer = require('multer')
const multerConfig = require('../config/multerLocal')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')

module.exports = app => {

    app.get('/metas', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            let id_login = false;
            let offices = [];
            let sellers;

            if (req.access.all.allowed) {
                sellers = await Sellers.list();
                offices = await Office.listOffice();
            } else {
                if (req.login.perfil == 4 || req.login.perfil == 8) {
                    let off = req.login.offices.map(of => of.code);
                    offices.push(off)

                    if (req.login.perfil == 4 && offices.length === 0) {
                        req.flash('error', 'Solicitar acceso a una sucursal.');
                        return res.redirect('/dashboard')
                    }
                } else {
                    id_login = req.login.id_login;
                }

                sellers = await Sellers.list(id_login, offices);
                offices = await Office.listOffice(req.login.id_login);
            }

            res.render('metas', {
                sellers,
                offices
            })
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

    app.get('/goalsalesman/:month/:office?/:seller?/:group?', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

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

            res.json(sellers);
        } catch (err) {
            next(err)
        }
    })

    app.get('/goaloffices/:month/:office/:group?', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            let offices;
            let month = req.params.month;
            let group = req.params.group;
            let office = req.params.office == "ALL" ? null : req.params.office;

            if (req.access.all.allowed) {
                offices = office;
                let ofs = await Goal.listOffice(month, offices, group);
                res.json(ofs);

            } else {
                offices = office ? office : req.login.offices.map(of => of.code);
                let ofs = await Goal.listOffice(month, offices, group);
                res.json(ofs);
            }

        } catch (err) {
            next(err)
        }
    })

    app.get('/goalcomparations/:months/:office/:id?', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            let months = JSON.parse(req.params.months);
            let office = req.params.office != "ALL" ? req.params.office : false;
            let id = req.params.id != "ALL" ? req.params.id : false;

            let ofs = await Goal.listComparation(months, office, id);
            res.json(ofs);
        } catch (err) {
            next(err)
        }
    })

    app.get('/goalstock/:month/:office/:id?', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            let offices;
            let month = req.params.month;
            let id = req.params.id ? req.params.id : false;
            let office = req.params.office == "ALL" ? false : req.params.office;

            if (req.access.all.allowed) {
                offices = office;
                let ofs = await Goal.listStock(month, offices, id);
                res.json(ofs);

            } else {
                offices = office ? office : req.login.offices.map(of => of.code);
                let ofs = await Goal.listStock(month, offices, id);
                res.json(ofs);
            }

        } catch (err) {
            next(err)
        }
    })

    app.get('/goalsline/:id_salesman/:office/:group/:stock', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {

            // const cached = await cachelist.searchValue(`goal:${JSON.stringify(req.params)}`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

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

    app.get('/goalslineexcel/:salesman/:groups/:stock', [Middleware.authenticatedMiddleware, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const salesman = req.params.salesman
            const groups = req.params.groups
            const stock = req.params.stock

            const wb = await GoalLine.listExcel(salesman, groups, stock)

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

            await Goal.upload(file, req.login)

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