const Controll = require('./accesscontrol')

const method = {
    read: {
        all: 'readAny',
        only: 'readOwn'
    },
    create: {
        all: 'createAny',
        only: 'createOwn'
    },
    delete: {
        all: 'deleteAny',
        only: 'deleteOwn'
    },
    update: {
        all: 'updateAny',
        only: 'updateOwn'
    }
}

module.exports = (entity, action) => (req, res, next) => {

    const permissionLogin = Controll.can(`${req.login.perfil}`)
    const actions = method[action]
    const permissionAll = permissionLogin[actions.all](entity)
    const permissionOnly = permissionLogin[actions.only](entity)

    if (permissionAll.granted === false && permissionOnly.granted === false) {
        res.status(403)
        res.end()
        return
    }

    req.access = {
        all: {
            allowed: permissionAll.granted,
            atributes: permissionAll.atributes
        },
        only: {
            allowed: permissionOnly.granted,
            atributes: permissionOnly.atributes
        }
    }

    next()
}