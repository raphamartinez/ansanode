const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')


class Sales {

    async list(items, salesman, date, group) {

        try {
            let sql = `
            SELECT IF(ig.Code = 13 AND sa.TransDate < '2022-01-01', 'XTIRE', ig.Name) AS name, SUM(sr.Qty) AS qty, SUM(IF(sa.Currency = "GS", sr.Price/ sa.BaseRate, IF(sa.Currency = "RE", sr.Price * sa.FromRate / sa.BaseRate, sr.Price))) AS price
            FROM SalesOrder sa
            INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
            LEFT JOIN Item it ON sr.ArtCode = it.Code 
            LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            WHERE sa.SalesMan = ?
            AND sa.TransDate BETWEEN ? AND LAST_DAY(?) `

            if (items && items.length > 0) sql += ` AND it.Code IN (${items})`
            if (group) sql += ` AND IF(LAST_DAY(?) < '2022-01-01' AND '${group}' = 'XTIRE', ig.Code = 13, ig.Name = '${group}') `

            sql += `GROUP BY ig.Name
            ORDER BY ig.Name`


            const result = await queryhbs(sql, [salesman, `${date}-01`, `${date}-10`, `${date}-01`])
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async listOffice(items, offices, month, salesman) {
        try {

            let sql = `
            SELECT IF(ig.Code = 13 AND sa.TransDate < '2022-01-01', 'XTIRE', ig.Name) AS name, SUM(sr.Qty) AS amount, 
            SUM(IF(sa.Currency = "GS", sr.RowNet/ sa.BaseRate, IF(sa.Currency = "RE", sr.RowNet * sa.FromRate / sa.BaseRate, sr.RowNet))) AS price
            FROM SalesOrderItemRow sr 
            INNER JOIN SalesOrder sa ON sr.masterId  = sa.internalId
            LEFT JOIN Item it ON sr.ArtCode = it.Code 
            LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            WHERE (sa.Closed = 0 OR sa.Closed IS NULL)
            AND (sa.Invalid = 0 OR sa.Invalid IS NULL)
            AND sa.TransDate BETWEEN ? AND LAST_DAY(?) `

            if (items) sql += ` AND sr.ArtCode IN (${items}) `
            if (offices) sql += ` AND sa.Office IN (${offices}) `
            if (salesman) sql += ` AND sa.SalesMan = '${salesman}' `

            sql += ` GROUP BY ig.Name ORDER BY ig.Name ASC`

            const result = await queryhbs(sql, [`${month}-01`, `${month}-10`]);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async listItem(items, salesman, date) {
        try {
            let sql = `
            SELECT sr.ArtCode as itemcode, SUM(sr.RowNet) AS price, SUM(sr.Qty) AS amount
            FROM SalesOrder sa
            INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
            WHERE sa.SalesMan = ?
            AND sa.TransDate BETWEEN ? AND LAST_DAY(?) `

            if (items && items.length > 0) sql += ` AND sr.ArtCode IN (${items}) `

            const result = await queryhbs(sql, [salesman, `${date}-01`, `${date}-10`])

            return result[0]
        } catch (error) {
            console.log(error);
        }
    }

    async graphSalesDay(items, salesman, date, group) {
        try {
            let sql = `SELECT DATE_FORMAT(sa.TransDate, '%d/%m/%Y') as TransDate, SUM(sr.Qty) AS qty
            FROM SalesOrder sa
            INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
            LEFT JOIN Item it ON sr.ArtCode = it.Code 
            LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            WHERE sa.SalesMan = ?
            AND sa.TransDate BETWEEN ? AND LAST_DAY(?) `

            if (group) sql += ` AND IF(LAST_DAY(?) < '2022-01-01' AND '${group}' = 'XTIRE', ig.Code = 13, ig.Name = '${group}')`
            if (items && items.length > 0) sql += ` AND it.Code IN (${items}) `

            sql += ` GROUP BY sa.TransDate
            ORDER BY sa.TransDate ASC`

            const result = await queryhbs(sql, [salesman, `${date}-01`, `${date}-10`])
            return result
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async graphSalesDayOffice(items, office, date, group) {
        try {
            let sql = `SELECT DATE_FORMAT(sa.TransDate, '%d/%m/%Y') as TransDate, SUM(sr.Qty) AS qty
        FROM SalesOrder sa
        INNER JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
        LEFT JOIN Item it ON sr.ArtCode = it.Code 
        LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
        WHERE sa.TransDate BETWEEN ? AND LAST_DAY(?) `
        
            if (office) sql += `AND sa.Office = '${office}' `
            if (group) sql += ` AND IF(LAST_DAY(?) < '2022-01-01' AND '${group}' = 'XTIRE', ig.Code = 13, ig.Name = '${group}')' `
            if (items && items.length > 0) sql += ` AND it.Code IN (${items}) `

            sql += `GROUP BY sa.TransDate
        ORDER BY sa.TransDate ASC`

            const result = await queryhbs(sql, [`${date}-01`, `${date}-10`])
            return result
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async graphSalesDayComparation(items, office, date, salesman) {
        try {
            let sql = `SELECT dateList.Date as date,
            CASE WHEN sa.TransDate IS NULL THEN 0
            ELSE COUNT(sa.internalId) 
            END AS amt,
             DATE_FORMAT(dateList.Date, '%d/%m/%Y') as TransDate, 
             SUM(sa.Qty) AS qty
        FROM
        (
            SELECT a.Date
            FROM (
                SELECT LAST_DAY(?) - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS Date
                FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
                CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
                CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
            ) AS a
            WHERE a.Date between ? and LAST_DAY(?)
        ) AS dateList 
                LEFT JOIN (SELECT sa.internalId, DATE_FORMAT(sa.TransDate, '%d/%m/%Y') as TransDate, sa.TransDate AS date
                  , SUM(sr.Qty) AS qty
                FROM SalesOrder sa 
                LEFT JOIN SalesOrderItemRow sr ON sa.internalId = sr.masterId 
                LEFT JOIN Item it ON sr.ArtCode = it.Code 
                LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
                WHERE it.Code IN (${items})`

            if (office) sql += ` AND sa.Office = '${office}' `
            if (salesman) sql += ` AND sa.SalesMan = '${salesman}' `

            sql += `
                GROUP BY sa.TransDate
                ORDER BY sa.TransDate ASC) AS sa ON dateList.Date = Date(sa.date)
                Group BY dateList.Date
                ORDER BY dateList.Date`

            const result = await queryhbs(sql, [`${date}-01`, `${date}-01`, `${date}-01`])
            return result
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar las metas')
        }
    }

    async listExpectedGoals(items) {

        try {
            let sql = `
            SELECT ArtCode, MIN(Price) as Price FROM Price 
            WHERE ArtCode IN (${items})
            GROUP BY ArtCode 
            ORDER BY FIELD(ArtCode, ${items});`

            const result = await queryhbs(sql)
            return result
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Sales()