const Repositorie = require('../repositories/viewpowerbi')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class ViewPowerBi {

    async insertPowerBi(users, id_powerbi) {
        try {

            users.forEach(obj => {
                const viewpowerbi = {
                    id_powerbi: id_powerbi,
                    id_login: obj
                }

                Repositorie.insert(viewpowerbi)
            })

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear el powerbi.')
        }
    }

    async insertPowerBis(powerbis, id_login) {
        try {

            powerbis.forEach(async obj => {
                const viewpowerbi = {
                    id_login: id_login,
                    id_powerbi: obj
                }

                Repositorie.insert(viewpowerbi)
            })

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear el powerbi.')
        }
    }

    async delete(id_viewpowerbi) {
        try {
            const result = await Repositorie.delete(id_viewpowerbi)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi.')
        }
    }

    listPowerBi(id_powerbi) {
        try {
            return Repositorie.list(id_powerbi)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los powerbi.')
        }
    }

}

module.exports = new ViewPowerBi