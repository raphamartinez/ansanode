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

    app.get('/goals', [Middleware.bearer, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_login = req.login.id_login

            const goals = await Goal.listGoalsByManager(id_login)
            res.json(goals)
        } catch (err) {
            next(err)
        }
    })

    app.get('/goalsline/:id_salesman/:office/:group/:stock', [Middleware.bearer, Authorization('goal', 'read')], async (req, res, next) => {
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

    app.get('/goalslineexcel/:id_salesman/:groups', [Middleware.bearer, Authorization('goal', 'read')], async (req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            const groups = req.params.groups

            const wb = await GoalLine.listExcel(id_salesman, groups)

            wb.write('meta.xlsx', res)
        } catch (err) {
            next(err)
        }
    })


    app.post('/goal', [Middleware.bearer, Authorization('goal', 'create')], async (req, res, next) => {
        try {
            const goal = req.body.goal

            cachelist.delPrefix('goal')

            const result = await Goal.insert(goal)
            res.status(201).json(result)
        } catch (err) {
            next(err)
        }
    })

    app.post('/goalexcel', [Middleware.bearer, Authorization('goal', 'create')], multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const file = req.file

            cachelist.delPrefix('goal')

            const result = await Goal.upload(file)
            res.status(201).json(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/goal/:id_goal', [Middleware.bearer, Authorization('goal', 'update')], async (req, res, next) => {
        try {
            const goal = req.body
            const id_goal = req.params.id_goal

            cachelist.delPrefix('goal')

            const result = await Office.updateOffice(goal, id_goal)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/goal/:id_goal', [Middleware.bearer, Authorization('goal', 'delete')], async (req, res, next) => {
        try {
            const id_goal = req.params.id_goal

            cachelist.delPrefix('goal')

            const result = await Goal.delete(id_goal)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.get('/goalexpected/:id_salesman', [Middleware.bearer, Authorization('goal', 'read')], async (req, res, next) => {
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

    app.get('/goalexpectedmonth/:id_salesman/:date', [Middleware.bearer, Authorization('goal', 'read')], async (req, res, next) => {
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