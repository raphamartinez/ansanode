const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')


class Sales {


    async list(items, salesman, date, group) {

        try {
            let sql = `
            SELECT ig.Name AS name, SUM(sr.Qty) AS qty
            FROM SalesOrder sa
            INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
            LEFT JOIN Item it ON sr.ArtCode = it.Code 
            LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            WHERE sa.SalesMan = ?
            AND sa.TransDate BETWEEN ? AND LAST_DAY(?) `

            if (items && items.length > 0) sql += ` AND it.Code IN (${items})`
            if (group) sql += ` AND ig.Name = '${group}' `

            sql += `GROUP BY ig.Name
            ORDER BY ig.Name`


            const result = await queryhbs(sql, [salesman, `${date}-01`, `${date}-10`])
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async listItem(salesman, date) {
        try {
            let sql = `
            SELECT sr.ArtCode as itemcode, SUM(sr.RowNet) AS price, SUM(sr.Qty) AS amount
            FROM SalesOrder sa
            INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
            WHERE sa.SalesMan = ?
            AND sa.TransDate BETWEEN ? AND LAST_DAY(?) `

            const result = await queryhbs(sql, [salesman, `${date}-01`, `${date}-10`])

            return result
        } catch (error) {
            console.log(error);
        }
    }

    async graphSalesDay(salesman, date, group) {
        try {
            let sql = `SELECT DATE_FORMAT(sa.TransDate, '%d/%m/%Y') as TransDate, SUM(sr.Qty) AS qty
            FROM SalesOrder sa
            INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
            LEFT JOIN Item it ON sr.ArtCode = it.Code 
            LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            WHERE sa.SalesMan = ?
            AND sa.TransDate BETWEEN ? AND LAST_DAY(?) `

            if (group) sql += ` AND ig.Name = '${group}' `

            sql += `GROUP BY sa.TransDate
            ORDER BY sa.TransDate ASC`

            const result = await queryhbs(sql, [salesman, `${date}-01`, `${date}-10`])
            return result
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }
}

module.exports = new Sales()