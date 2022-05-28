const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Client {

    list(){
        try {
            let sql = `SELECT DISTINCT(re.CustCode), re.CustName
            FROM receivable re
            GROUP BY CustCode 
            ORDER BY re.CustName ASC`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

    listHbs(){
        try {
            let sql = `SELECT CODE as CustCode, NAME as CustName
            FROM Customer ce 
            ORDER BY CODE ASC`

            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

}

module.exports = new Client()