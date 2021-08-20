const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class GoalLine {

    async insert(goal) {
        try {
            const sql = 'INSERT INTO ansa.goalline (itemgroup, labelname, labelcode, application, provider, date) values (?, ?, ?, ?, ?, ?)'
            const result = await query(sql, [goal.itemgroup, goal.labelname, goal.labelcode, goal.application, goal.provider, goal.date])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }


    list(id_salesman) {
        try {
            let sql = `SELECT GL.id_goalline, GL.itemgroup, GL.provider, GL.application, GL.labelname, GL.labelcode, DATE_FORMAT(GL.date, '%m/%y') as date, GO.amount
            FROM ansa.goalline GL
            `

            if(id_salesman) {
                sql+= `LEFT JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline and GO.id_salesman = ${id_salesman}
                WHERE GL.application <> "DESCONSIDERAR"
                ORDER BY GL.date`
            } else{
                sql+= `LEFT JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline
                WHERE GL.application <> "DESCONSIDERAR"
                ORDER BY GL.date`
            }

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    async listDate(date) {
        try {
            const sql = 'SELECT * FROM goalline WHERE date = ?'
            const result = await query(sql, date)

            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

}

module.exports = new GoalLine()