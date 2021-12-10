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

 
    list(id_salesman, group) {
        try {
  
            let sql = `SELECT GL.id_goalline, GL.itemgroup, GL.provider, GL.application, GL.labelname, GL.labelcode, GL.itemcode, GL.itemname, 
            SUM(IF(MONTH(GL.date) = MONTH(NOW()), GO.amount, 0)) as g1, (SELECT DATE_FORMAT(NOW(), '%Y-%m')) as d1,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 1 month)), GO.amount, 0)) as g2, (SELECT DATE_FORMAT(NOW() + interval 1 month, '%Y-%m')) as d2,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 2 month)), GO.amount, 0)) as g3, (SELECT DATE_FORMAT(NOW() + interval 2 month, '%Y-%m')) as d3,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 3 month)), GO.amount, 0)) as g4, (SELECT DATE_FORMAT(NOW() + interval 3 month, '%Y-%m')) as d4,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 4 month)), GO.amount, 0)) as g5, (SELECT DATE_FORMAT(NOW() + interval 4 month, '%Y-%m')) as d5,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 5 month)), GO.amount, 0)) as g6, (SELECT DATE_FORMAT(NOW() + interval 5 month, '%Y-%m')) as d6,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 6 month)), GO.amount, 0)) as g7, (SELECT DATE_FORMAT(NOW() + interval 6 month, '%Y-%m')) as d7,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 7 month)), GO.amount, 0)) as g8, (SELECT DATE_FORMAT(NOW() + interval 7 month, '%Y-%m')) as d8,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 8 month)), GO.amount, 0)) as g9, (SELECT DATE_FORMAT(NOW() + interval 8 month, '%Y-%m')) as d9,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 9 month)), GO.amount, 0)) as g10, (SELECT DATE_FORMAT(NOW() + interval 9 month, '%Y-%m')) as d10,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 10 month)), GO.amount, 0)) as g11, (SELECT DATE_FORMAT(NOW() + interval 10 month, '%Y-%m')) as d11,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 11 month)), GO.amount, 0)) as g12, (SELECT DATE_FORMAT(NOW() + interval 11 month, '%Y-%m')) as d12,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 12 month)), GO.amount, 0)) as g13, (SELECT DATE_FORMAT(NOW() + interval 12 month, '%Y-%m')) as d13
            FROM ansa.goalline GL
            LEFT JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline and GO.id_salesman = ?
            WHERE GL.application <> "DESCONSIDERAR"
            AND GL.itemgroup = ?
            GROUP BY GL.itemcode
            ORDER BY GL.date`
            

            return query(sql, [id_salesman, group])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }


    async listExcel(id_salesman, groups) {
        try {
  
            let sql = `SELECT (SELECT code from ansa.salesman where id_salesman = ?) as code,GL.id_goalline, GL.itemgroup, GL.provider, GL.application, GL.labelcode, GL.labelname, GL.itemcode, GL.itemname, '' as stockCity, '' as stockAnsa,
            SUM(IF(MONTH(GL.date) = MONTH(NOW()), GO.amount, 0)) as g1, 
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 1 month)), GO.amount, 0)) as g2, 
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 2 month)), GO.amount, 0)) as g3, 
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 3 month)), GO.amount, 0)) as g4, 
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 4 month)), GO.amount, 0)) as g5,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 5 month)), GO.amount, 0)) as g6,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 6 month)), GO.amount, 0)) as g7, 
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 7 month)), GO.amount, 0)) as g8, 
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 8 month)), GO.amount, 0)) as g9,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 9 month)), GO.amount, 0)) as g10, 
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 10 month)), GO.amount, 0)) as g11, 
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 11 month)), GO.amount, 0)) as g12,
            SUM(IF(MONTH(GL.date) = (MONTH(NOW() + interval 12 month)), GO.amount, 0)) as g13
            FROM ansa.goalline GL
            LEFT JOIN ansa.goal GO ON GL.id_goalline = GO.id_goalline and GO.id_salesman = ?
            WHERE GL.application <> "DESCONSIDERAR"
            AND GL.itemgroup IN (${groups})
            GROUP BY GL.itemcode
            ORDER BY GL.itemcode`
            

            const data = await query(sql, [id_salesman, id_salesman, groups])

            return data
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