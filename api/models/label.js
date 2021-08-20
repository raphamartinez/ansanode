const Repositorie = require('../repositories/label')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const xlsx = require('read-excel-file/node')

class Label {

    async insert(data) {
        try {
            data.forEach(obj => {
                Repositorie.insert(obj)
            })

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear un nuevo vendedor.')
        }
    }

    list() {
        try {
            return Repositorie.list()
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los vendedores.')
        }
    }

    update(label){
        try {
            return Repositorie.update(label)
        } catch (error) {
            throw new InternalServerError('No se pude actualizar lo vendedor.')
        }
    }

    delete(id_label) {
        try {
            return Repositorie.delete(id_label)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }

    async readexcel() {
        try {
            const filePath = `etiqueta.xlsx`

            const data = await xlsx(filePath).then((rows) => {
                return rows
            })

            data.forEach(obj => {

                const label = {
                    code: obj[0],
                    provider: obj[1],
                    application: obj[2]
                }

                Label.insert(label)
            })

        } catch (error) {

        }
    }
}

module.exports = new Label