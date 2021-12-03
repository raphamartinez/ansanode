const Repositorie = require('../repositories/history')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class History {

    async dashboard(id_login) {
        try {
            let count = await Repositorie.count(id_login)
            let lastAccess = await Repositorie.lastAccess(id_login)

            return { count, lastAccess }
        } catch (error) {
            throw new InternalServerError('Error al mostrar el historial.')
        }
    }

    async list(id_login) {
        try {
            return Repositorie.list(id_login)
        } catch (error) {
            throw new NotFound('Error al mostrar el historial.')
        }
    }

    async viewHistory(id) {
        try {
            const history = await Repositorie.viewHistory(id)

            return new History(history)
        } catch (error) {
            throw new InternalServerError('No se pudo ver el historial.')
        }
    }

    async insertHistory(description, id_login) {
        try {
            const history = {
                description: description,
                id_login: id_login
            }

            Repositorie.insert(history)
        } catch (error) {
            throw new InternalServerError('No se pudo insertar un nuevo historial.')
        }
    }

    async deleteHistory(id) {
        try {
            const result = await Repositorie.delete(id)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el historial.')
        }
    }

    async updateHistory(id, history) {
        try {
            const result = await Repositorie.update(id, history)

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el historial.')
        }
    }
}

module.exports = new History