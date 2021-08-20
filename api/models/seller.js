const Repositorie = require('../repositories/seller')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Seller {

    async insert(data) {
        try {
            data.forEach(obj => {
                const salesman = JSON.parse(obj.toString())
                Repositorie.insert(salesman)
            })

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear un nuevo vendedor.')
        }
    }

    list(id_login) {
        try {
            return Repositorie.list(id_login)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los vendedores.')
        }
    }

    update(manager){
        try {
            return Repositorie.update(manager)
        } catch (error) {
            throw new InternalServerError('No se pude actualizar lo vendedor.')
        }
    }

    delete(id_salesman) {
        try {
            return Repositorie.delete(id_salesman)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new Seller