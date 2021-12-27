const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')


class Sales {


    async list(salesman, date, group) {
        try {
            let sql = `
            SELECT ig.Name AS name, SUM(sr.Qty) AS qty
            FROM SalesOrder sa
            INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
            LEFT JOIN Item it ON sr.ArtCode = it.Code 
            LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            WHERE sa.SalesMan = ?
            AND sa.TransDate BETWEEN ? AND ? `

            if(group) sql+= ` AND ig.Name = '${group}' `

            sql+= `GROUP BY ig.Name
            ORDER BY ig.Name`


            const result = await queryhbs(sql, [salesman, `${date}-01`, `${date}-30`])

            return result
        } catch (error) {
            console.log(error);
        }
    }

    async graphSalesDay(salesman, date, group){
        try {
            let sql = `SELECT DATE_FORMAT(sa.TransDate, '%d/%m/%Y') as TransDate, SUM(sr.Qty) AS qty
            FROM SalesOrder sa
            INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
            LEFT JOIN Item it ON sr.ArtCode = it.Code 
            LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            WHERE sa.SalesMan = ?
            AND sa.TransDate BETWEEN ? AND ? `

            if(group) sql+= ` AND ig.Name = '${group}' `

            sql+= `GROUP BY sa.TransDate
            ORDER BY sa.TransDate ASC`

            const result = await queryhbs(sql, [salesman, `${date}-01`, `${date}-30`])
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }
}

module.exports = new Sales()