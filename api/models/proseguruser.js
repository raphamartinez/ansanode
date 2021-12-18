const Repositorie = require('../repositories/proseguruser')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class ProsegurUser {

    insert(user) {
        try {
            return Repositorie.insert(user)
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear una nueva sucursal.')
        }
    }

    drop(id) {
        try{
            return Repositorie.drop(id)
        }catch(error){
            throw new InternalServerError('No se pudo borrar la sucursal.')
        }
    }

    list(office) {
        try {
            return Repositorie.list(office)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }

    listProsegur(office, period, type) {
        try {
            return Repositorie.listProsegur(office, period, type)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }
}

module.exports = new ProsegurUser