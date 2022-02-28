const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Invoice {

    listAnalysis(search){
        try {
            let sql = `SELECT iv.CustCode AS code, iv.CustName AS name, TRUNCATE(SUM(IF(ir.Qty <0,ir.Qty *-1,ir.Qty) * ir.Price),2) AS amount, iv.Currency as currency, ir.Qty as qty
            FROM InvoiceItemRow ir 
            INNER JOIN Invoice iv  ON ir.masterId = iv.internalId
            WHERE iv.TransDate BETWEEN ? AND LAST_DAY(?)
            AND iv.Office IN (?) `

            if(search.clients && search.clients[0] == 'ALL') sql+= ` AND iv.CustCode IN (${search.clients}) `

            sql+= ` GROUP BY iv.CustCode, iv.Currency 
            ORDER BY CODE ASC `

            return queryhbs(sql, [`${search.month}-01`, `${search.month}-10`, search.offices])
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

}

module.exports = new Invoice()