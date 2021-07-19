const File = require('../models/file')
const Middleware = require('../infrastructure/auth/middleware')
const multer = require('multer')
const multerConfig = require('../config/multer')

module.exports = app => {

    app.post('/file', Middleware.bearer, multer(multerConfig).single('file'), async (req, res, next) => {
        try {
            const file = req.file
            const details = req.body
            const id_login = req.login.id_login

            const path = await File.save(file, details, id_login)

            res.json(file.filename)
        } catch (error) {
            next(error)
        }
    })

    app.delete('/file/:id_file', Middleware.bearer, async (req, res, next) => {
        try {
            const id_file = req.params.id_file

            const result = await File.delete(id_file)

            res.json(result)
        } catch (error) {
            next(error)
        }
    })

    app.get('/files/:type/:title', Middleware.bearer, async (req, res, next) => {
        try {

            const file = {
                type: req.params.type,
                title: req.params.title 
            }

            const files = await File.list(file)

            res.json(files)
        } catch (error) {
            next(error)
        }
    })

    app.get('/file/:id_file', Middleware.bearer, async (req, res, next) => {
        try {
            const id_file = req.params.id_file

            const file = await File.view(id_file)

            res.json(file)
        } catch (error) {
            next(error)
        }
    })
}