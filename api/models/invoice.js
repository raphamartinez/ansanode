
const Repositorie = require('../repositories/invoice')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Invoice {

    listAnalysis(search) {
        try {
            return Repositorie.listAnalysis(search)
        } catch (error) {
            throw new InternalServerError('No se pude listar las orders.')
        }
    }

}

module.exports = new Invoice