const Patrimony = require('../models/patrimony')
const Middleware = require('../infrastructure/auth/middleware')
const Authorization = require('../infrastructure/auth/authorization')
const cachelist = require('../infrastructure/redis/cache')
const multer = require('multer')
const multerConfig = require('../config/multer')

module.exports = app => {

    app.get('/patrimony/files/:id', [Middleware.bearer, Authorization('patrimony', 'read')], async (req, res, next) => {
        try {
            const id = req.params.id
            const images = await Patrimony.listImages(id)

            res.json(images)
        } catch (err) {
            next(err)
        }
    })

    app.get('/patrimony/details/:id', [Middleware.bearer, Authorization('patrimony', 'read')], async (req, res, next) => {
        try {
            const id = req.params.id
            const details = await Patrimony.listDetails(id)

            res.json(details)
        } catch (err) {
            next(err)
        }
    })


    app.get('/patrimonys/:offices/:types', [Middleware.bearer, Authorization('patrimony', 'read')], async (req, res, next) => {
        try {

            let offices = req.params.offices
            let types = req.params.types

            // const cached = await cachelist.searchValue(`patrimonys/${offices}/${types}`)

            // if (cached) {
            //     return res.json(JSON.parse(cached))
            // }

            const patrimonys = await Patrimony.list(offices, types)

            await cachelist.addCache(`patrimonys/${offices}/${types}`, JSON.stringify(patrimonys), 60 * 60 * 3)

            res.json(patrimonys)
        } catch (err) {
            next(err)
        }
    })

    app.get('/patrimony/types', [Middleware.bearer, Authorization('patrimony', 'read')], async (req, res, next) => {
        try {
            let types
            let offices

            if (req.access.all.allowed) {

                types = await Patrimony.listTypes()

                await cachelist.addCache('patrimony/types', JSON.stringify(types), 60 * 60 * 3)
            } else {
                if (!offices) offices = req.login.offices

                types = await Patrimony.listTypes(offices)
            }

            res.json(types)
        } catch (err) {
            next(err)
        }
    })

    app.post('/patrimony', [Middleware.bearer, Authorization('patrimony', 'create')],
        multer(multerConfig)
            .array('file', 10), async (req, res, next) => {
                try {
                    const files = req.files
                    const details = req.body

                    const id = await Patrimony.insert(files, details, req.login.id_login)

                    res.json({ id, msg: `Patrimonio agregado con éxito!` })
                } catch (err) {
                    next(err)
                }
            })

    app.put('/patrimony/:id', [Middleware.bearer, Authorization('patrimony', 'update')], async (req, res, next) => {
        try {
            const patrimony = req.body.patrimony

            await Patrimony.update(patrimony)
            cachelist.delPrefix('patrimony')

            res.json({ msg: `Patrimonio actualizado correctamente.` })
        } catch (err) {
            next(err)
        }
    })

    app.post('/patrimony/upload', [Middleware.bearer, Authorization('patrimony', 'create')],
    multer(multerConfig)
        .array('file', 10), async (req, res, next) => {
            try {
                const files = req.files
                const details = req.body

                await Patrimony.insertFile(files, details, req.login.id_login)

                res.json({ msg: `Imagen agregada con éxito!` })
            } catch (err) {
                next(err)
            }
        })


        app.delete('/patrimony/:id', [Middleware.bearer, Authorization('patrimony', 'delete')], async ( req, res, next) => {
            try {
                await Patrimony.delete(req.params.id)
                cachelist.delPrefix('patrimony')
                
                res.json({msg: `Patrimonio eliminado correctamente.`})
            } catch (err) {
                console.log(err);
                next(err)
            }
        })

        app.delete('/patrimony/image/:id/:name', [Middleware.bearer, Authorization('patrimony', 'delete')], async ( req, res, next) => {
            try {
                await Patrimony.deleteImage(req.params.id, req.params.name)
                
                res.json({msg: `Imagen eliminada correctamente.`})
            } catch (err) {
                console.log(err);
                next(err)
            }
        })
}