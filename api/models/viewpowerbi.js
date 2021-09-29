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

    async deletePowerBi(id_viewpowerbi) {
        try {
            const result = await Repositorie.delete(id_viewpowerbi)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudo borrar el powerbi.')
        }
    }

    listPowerBi() {
        try {
            return Repositorie.list()
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los powerbi.')
        }
    }

}

module.exports = new ViewPowerBi