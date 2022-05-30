const query = require('../infrastructure/database/queries')
const queryold = require('../infrastructure/database/queriesold')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Trasfer {

    async goal() {
        const sql = 'SELECT * FROM viewpowerbi'
        const data = await queryold(sql)

        for (let obj of data) {
            const sqlInsert = 'INSERT INTO viewpowerbi set ?'
            const data = await query(sqlInsert, obj)

            console.log(data);
        }
    }
}

module.exports = new Trasfer