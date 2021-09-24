const Repositorie = require('../repositories/history')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class History {

    async listHistoryDashboard(perfil, id_login) {
        try {
            if (perfil === 1) {
                const count = await Repositorie.countInTheTime()
                const lastAccess = await Repositorie.lastAccess()

                return { count, lastAccess }
            } else {
                const count = await Repositorie.countInTheTimeUser(id_login)
                const lastAccess = await Repositorie.lastAccessUser(id_login)

                return { count, lastAccess }
            }

        } catch (error) {
            throw new NotFound('Historial.')
        }
    }

    async list(id_login) {
        try {
            return Repositorie.list(id_login)
        } catch (error) {
            throw new NotFound('Historial.')
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