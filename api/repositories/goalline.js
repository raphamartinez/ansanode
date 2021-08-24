const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class GoalLine {

    async insert(goal) {
        try {
            const sql = 'INSERT INTO ansa.goalline (itemname, itemcode, itemgroup, labelname, labelcode, application, provider, date) values (?, ?, ?, ?, ?, ?, ?, ?)'
            const result = await query(sql, [goal.itemname, goal.itemcode, goal.itemgroup, goal.labelname, goal.labelcode, goal.application, goal.provider, goal.date])

            return result
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

 
    list(id_salesman, date) {
        try {
            let sql = `SELECT GL.id_goalline, GL.itemgroup, GL.provider, GL.application, GL.labelname, GL.labelcode, GL.itemcode, GL.itemname, DATE_FORMAT(GL.date, '%m/%y') as date, GO.amount
            FROM ansa.goalline GL
            `

            if(id_salesman) {
                sql+= `LEFT JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline and GO.id_salesman = ${id_salesman}
                WHERE GL.application <> "DESCONSIDERAR"
                AND GL.date = '${date}-01'
                ORDER BY GL.date`
            } else{
                sql+= `LEFT JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline
                WHERE GL.application <> "DESCONSIDERAR"
                AND GL.date = '${date}-01'
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

    async countLineGoal(){
        try {
            let sql = `SELECT count(GL.id_goalline) as goalline, DATE_FORMAT(GL.date, '%m/%y') as date
            FROM ansa.goalline GL
            WHERE GL.application <> "DESCONSIDERAR"
            GROUP BY date
            ORDER BY date DESC`

            const result = await query(sql)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async countSellersGoal(){
        try {
            let sql = `SELECT SA.name, DATE_FORMAT(GL.date, '%m/%y') as date, COUNT(GO.amount) as amount
            FROM ansa.salesman SA
            LEFT JOIN ansa.goal GO ON SA.id_salesman = GO.id_salesman
            LEFT JOIN ansa.goalline GL ON GO.id_goalline = GL.id_goalline 
            WHERE GL.application <> "DESCONSIDERAR"
            group by SA.name
            ORDER BY SA.name`

            const result = await query(sql)
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

}

module.exports = new GoalLine()