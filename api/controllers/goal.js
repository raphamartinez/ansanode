const Goal = require('../models/goal')
const GoalLine = require('../models/goalline')
const Middleware = require('../infrastructure/auth/middleware')

module.exports = app => {

    app.get('/goals', Middleware.bearer, async ( req, res, next) => {
        try {
            const goals = await Goal.list()
            res.json(goals)
        } catch (err) {
            next(err)
        }
    })

    app.get('/goalsline', Middleware.bearer, async ( req, res, next) => {
        try {
            const goalsline = await GoalLine.list()
            res.json(goalsline)
        } catch (err) {
            next(err)
        }
    })

    app.get('/goalsline/:id_salesman', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_salesman = req.params.id_salesman
            
            const goalsline = await GoalLine.list(id_salesman)
            res.json(goalsline)
        } catch (err) {
            next(err)
        }
    })

    app.get('/goals/:id_goal', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_goal = req.params.id_goal

            const goal = await Goal.list(id_goal)
            res.json(goal)
        } catch (err) {
            next(err)
        }
    })

    app.post('/goal', Middleware.bearer, async ( req, res, next) => {
        try {
            const goal = req.body.goal

            const result = await Goal.insert(goal)
            res.status(201).json(result)
        } catch (err) {
            next(err)
        }
    })

    app.put('/goal/:id_goal', Middleware.bearer, async ( req, res, next) => {
        try {
            const goal = req.body
            const id_goal = req.params.id_goal

            const result = await Office.updateOffice(goal, id_goal)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })

    app.delete('/goal/:id_goal', Middleware.bearer, async ( req, res, next) => {
        try {
            const id_goal = req.params.id_goal

            const result = await Goal.delete(id_goal)
            res.json(result)
        } catch (err) {
            next(err)
        }
    })
}