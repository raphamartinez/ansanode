const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class SurveyMonkey {

    async insert(asset) {
        try {
            const sql = 'INSERT INTO ansa.companyassets (responseId, name, plate, url) values (?, ?, ?, ?)'
            const result = await query(sql, [asset.responseId, asset.name, asset.plate, asset.url])

        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }


    list() {
        try {
            const sql = 'SELECT * FROM companyassets'
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }
}

module.exports = new SurveyMonkey()