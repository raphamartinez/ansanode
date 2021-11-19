const Repositorie = require('../repositories/crm')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Crm {

    async create(crm, id_login) {
        try {
            crm.status = 1

            const id = await Repositorie.insert(crm, id_login)

            for (const product of crm.products) {
                product.id_crm = id

                await Repositorie.insertProduct(product)
            };

            return id
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo crear una nueva sucursal.')
        }
    }

    async update(data, id) {
        try {
            const result = await Repositorie.update(data, id)
            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el sucursal.')
        }
    }

    async delete(id) {
        try {
            const result = await Repositorie.delete(id)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar la sucursal.')
        }
    }

    async list(search) {
        try {

            const crms = await Repositorie.list(search)

            const types = await Repositorie.listProductsType(search)

            const days = await Repositorie.listProductsDay(search)

            const clients = await Repositorie.listProductsClient(search)

            return { crms, types, days, clients }
        } catch (error) {
            console.log(error);

            throw new InternalServerError('No se pudieron enumerar.')
        }
    }

    listProducts(id) {
        try {
            return Repositorie.listProducts(id)
        } catch (error) {
            console.log(error);

            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }
}

module.exports = new Crm