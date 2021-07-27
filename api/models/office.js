const Repositorie = require('../repositories/office')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Office {

    async createOffice(data) {
        try {
            const office = {
                name: data.office,
                status: 1
            }

            const result = await Repositorie.insert(office)
            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear una nueva sucursal.')
        }
    }

    async updateOffice(data, id_office) {
        try{

            const office = {
                id_office: id_office, 
                name: data.name,
            }

            const result = await Repositorie.update(office)
            return result
        }catch(error){
            throw new InvalidArgumentError('No se pudo actualizar el sucursal.')
        }
    }

    async deleteOffice(id_office) {
        try{
            const result = await Repositorie.delete(id_office)
            return result
        }catch(error){
            throw new InternalServerError('No se pudo borrar la sucursal.')
        }
    }

    async viewOffice(id_office) {
        try{
            const result = await Repositorie.view(id_office)
            return result
        }catch(error){
            throw new InternalServerError('No se pudo ver la sucursal.')
        }
    }

    listOffice() {
        try {
            return Repositorie.list()
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }
}

module.exports = new Office