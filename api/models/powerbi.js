const Repositorie = require('../repositories/powerbi')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class PowerBi {

    async insertPowerBi(powerbi) {
        try {
            const id_powerbi = await Repositorie.insert(powerbi)
            return id_powerbi
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear el powerbi.')
        }
    }

    async deletePowerBi(id_powerbi) {
        try {
            const result = await Repositorie.delete(id_powerbi)
            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo borrar el powerbi.')
        }
    }

    async updatePowerBi(report, id) {
        try {
            const result = await Repositorie.update(report, id)
            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el powerbi.')
        }
    }

    async listPowerBis(id_login) {
        try {
            const data = await Repositorie.listLogin(id_login)

            data.forEach(powerbi => {

                switch (powerbi.type) {
                    case 1: powerbi.typedesc = 'Informe'
                        break

                    case 2: powerbi.typedesc = 'Personal'
                        break

                    case 3: powerbi.typedesc = 'Seguridad - Vehículos'
                        break

                    case 4: powerbi.typedesc = 'Seguridad - Sucursales'
                        break
                }
            })

            return data
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar powerbi.')
        }
    }

    list(id_login, type) {
        try {
            return Repositorie.list(id_login, type)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar powerbi.')
        }
    }

    async viewPowerBi(id_powerbi) {
        try {
            const powerbi = await Repositorie.view(id_powerbi)
            return powerbi
        } catch (error) {
            throw new InternalServerError('No se pudo ver powerbi.')
        }
    }

    async listBis() {
        try {
            const data = await Repositorie.listBis()

            data.forEach(powerbi => {

                switch (powerbi.type) {
                    case 1: powerbi.typedesc = 'Informe'
                        break

                    case 2: powerbi.typedesc = 'Personal'
                        break

                    case 3: powerbi.typedesc = 'Seguridad - Vehículos'
                        break

                    case 4: powerbi.typedesc = 'Seguridad - Sucursales'
                        break
                }
            })

            return data
        } catch (error) {
            throw new InternalServerError('No se pudo ver powerbi.')
        }
    }
}

module.exports = new PowerBi