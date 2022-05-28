const query = require('../infrastructure/database/queries')
const querynew = require('../infrastructure/database/queriesnew')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Transfer {

    async itemprice() {
        //answeredinterview
        try {
            let sql = `SELECT * FROM itemprice where id > 33391`

            const data = await query(sql)

            for (const obj of data) {
                let sqlI = `insert into ANSA.itemprice set ?`

                const result = await querynew(sqlI, obj)
                console.log(result);
            }
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async inviolaveloffice() {
        //answeredinterview
        try {
            let sql = `SELECT * FROM inviolaveloffice where id_inviolaveloffice > 4965`

            const data = await query(sql)

            for (const obj of data) {
                let sqlI = `insert into ANSA.inviolaveloffice set ?`

                const result = await querynew(sqlI, obj)
                console.log(result);
            }
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async history() {
        //answeredinterview
        try {
            let sql = `SELECT * FROM history where id_history > 3460`

            const data = await query(sql)

            for (const obj of data) {
                let sqlI = `insert into ANSA.history set ?`

                const result = await querynew(sqlI, obj)
                console.log(result);
            }
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async finishLater() {
        //answeredinterview
        try {
            let sql = `SELECT * FROM goalline where id_goalline > 69025`

            const data = await query(sql)

            for (const obj of data) {
                let sqlI = `insert into ANSA.goalline set ?`

                const result = await querynew(sqlI, obj)
                console.log(result);
            }
        } catch (error) {
            throw new InternalServerError(error)
        }
    }
}

module.exports = new Transfer()