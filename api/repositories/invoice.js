const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Invoice {

    listAnalysis(search) {
        try {
            let sql = `SELECT iv.CustCode AS code, iv.CustName AS name, IF(ig.Code = 13 AND iv.TransDate < '2022-01-01', 'XTIRE', ig.Name) AS groupName, TRUNCATE(SUM(IF(ir.Qty <0,ir.Qty *-1,ir.Qty) * ir.Price),2) AS amount, iv.Currency as currency, ir.Qty as qty
            FROM InvoiceItemRow ir 
            LEFT JOIN Item it ON ir.ArtCode = it.Code 
            LEFT JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            INNER JOIN Invoice iv  ON ir.masterId = iv.internalId
            WHERE iv.TransDate BETWEEN ? AND LAST_DAY(?)
            AND iv.CustCode NOT IN (1, 4, 716, 717, 128414)
            AND iv.Office IN (${search.offices}) `

            if (search.clients && search.clients[0] == 'ALL') sql += ` AND iv.CustCode IN (${search.clients}) `
            if (search.groups && search.groups[0] == 'ALL') {
                let groups = []
                for (let group of search.groups) {
                    group == '2809' ? groups.push('13') : groups.push(group)
                }
                sql += ` AND ig.Code IN (${groups}) `
            }

            sql += ` GROUP BY iv.CustCode, ig.Name, iv.Currency 
            ORDER BY CODE ASC `

            return queryhbs(sql, [`${search.start}-01`, `${search.end}-10`])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

}

module.exports = new Invoice()