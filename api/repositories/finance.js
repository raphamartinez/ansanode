const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Finance {

    async insert(finance, id_login) {
        try {
            const sql = `INSERT INTO ansa.financeinvoice (invoicenr, contactdate, responsible, contact, comment, payday, status, datereg, id_login) values (?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour, ?)`

            const result = await query(sql, [finance.invoicenr, finance.contactdate, finance.responsible, finance.contact, finance.comment, finance.payday, finance.status, id_login])
            return result[0]
        } catch (error) {
            console.log(error);

            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async check(finance) {
        try {
            const sql = `SELECT * FROM ansa.financeinvoice WHERE invoicenr = ? AND datereg > NOW() - interval 1 day`
            const result = await query(sql, finance.invoicenr)

            return result[0]
        } catch (error) {
            
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async update(finance, id_login) {
        try {
            const sql = `UPDATE ansa.financeinvoice SET contactdate = ?, responsible = ?, contact = ?, comment = ?, payday = ?, status = ?, id_login = ? WHERE id_financeinvoice = ?`
            const result = await query(sql, [finance.contactdate, finance.responsible, finance.contact, finance.comment, finance.payday, finance.status, id_login, finance.id_financeinvoice])

            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    listDistinctClients() {
        try {
            let sql = `SELECT DISTINCT(re.CustCode), re.CustName
            FROM ansa.receivable re
            GROUP BY CustCode 
            ORDER BY re.CustName ASC`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }


    async listClient(client, d1, d2) {
        try {
            let sql = `SELECT t.SalesMan, t.date, t.CustCode, t.CustName, t.SerNr, t.daysOverdue, t.DueDate, t.amount, t.payday, t.comment, t.responsible, t.contact, t.contactdate, t.dateReg, t.status
            FROM (SELECT DATE_FORMAT(re.date, '%H:%i %d/%m/%Y') as date, re.SalesMan, re.CustCode, re.CustName, re.SerNr, IF(DATEDIFF(NOW(), re.DueDate) > 0,DATEDIFF(NOW(), re.DueDate),0)  as daysOverdue, DATE_FORMAT(re.DueDate, '%d/%m/%Y') as DueDate,
            TRUNCATE(SUM(IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total))))),2) as amount, fi.status,
            DATE_FORMAT(fi.contactdate, '%Y-%m-%dT%H:%i') as contactdate,if(fi.datereg > NOW() - interval 1 day , DATE_FORMAT(fi.payday, '%Y-%m-%d'), "") as payday, if(fi.datereg > NOW() - interval 1 day ,fi.comment,"") as comment, if(fi.datereg > NOW() - interval 1 day ,fi.responsible,"") as responsible, 
            if(fi.datereg > NOW() - interval 1 day ,fi.contact,"") as contact, if(fi.datereg > NOW() - interval 1 day ,DATE_FORMAT(fi.datereg, '%H:%i %d/%m/%Y'), "") as dateReg
            FROM ansa.receivable re
            LEFT JOIN ansa.financeinvoice fi ON re.SerNr = fi.invoicenr `

            sql += `WHERE re.CustCode = '${client}' `

            if (d1) {
                sql += `AND re.DueDate BETWEEN '${d1}' AND '${d2}' `
            } else {
                sql += `AND re.DueDate BETWEEN '2000-01-01' AND NOW() `
            }

            sql += `
            GROUP BY re.SerNr) as t
            GROUP BY SerNr `

            const data = await query(sql)

            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    list(clients, offices) {
        try {
            let sql = `SELECT re.CustCode, re.CustName, 

            TRUNCATE(SUM(IF(re.DueDate <= now() AND re.DueDate >= (now() - interval 15 day), IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as d15,
            
            TRUNCATE(SUM(IF(re.DueDate < (now() - interval 15 day) AND re.DueDate >= (now() - interval 30 day), IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as d30,
            
            TRUNCATE(SUM(IF(re.DueDate < (now() - interval 30 day) AND re.DueDate >= (now() - interval 60 day), IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as d60,
            
            TRUNCATE(SUM(IF(re.DueDate < (now() - interval 60 day) AND re.DueDate >= (now() - interval 90 day), IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as d90,
            
            TRUNCATE(SUM(IF(re.DueDate < (now() - interval 90 day) AND re.DueDate >= (now() - interval 120 day), IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as d120,
            
            TRUNCATE(SUM(IF(re.DueDate < (now() - interval 120 day), IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as d120more,
            
            TRUNCATE(SUM(IF(re.DueDate > now(), IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as AmountOpen,
            
            TRUNCATE(SUM(IF(re.DueDate <= now(),IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as AmountBalance
            
            FROM ansa.receivable re
            WHERE re.CustCode <> 1
            `


            if (offices !== "ALL") sql += `AND re.Office IN (${offices})`

            if (clients !== "ALL") sql += `AND re.CustCode IN (${clients})`

            sql += `GROUP BY re.CustCode `

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }

    listInvoiceHistory(invoice) {
        try {
            let sql = `SELECT fi.id_financeinvoice, fi.invoicenr, fi.comment, fi.contact, fi.responsible, fi.status, DATE_FORMAT(fi.payday, '%d/%m/%Y') as payday, DATE_FORMAT(fi.contactdate, '%H:%i %d/%m/%Y') as contactdate,
            DATE_FORMAT(fi.datereg, '%H:%i %d/%m/%Y') as datereg, us.name
            FROM ansa.financeinvoice fi
            INNER JOIN ansa.user us ON fi.id_login = us.id_login
            WHERE invoicenr = ?
            ORDER BY datereg ASC`

            return query(sql, invoice)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los history')
        }
    }
}

module.exports = new Finance()