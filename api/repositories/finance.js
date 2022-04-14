const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Finance {

    async insert(finance, id_login) {
        try {
            const sql = `INSERT INTO ansa.financeinvoice (invoicenr, contactdate, responsible, contact, comment, payday, status, office, amount, client, typecoin, payterm, datereg, id_login) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 3 hour, ?)`

            const result = await query(sql, [finance.invoicenr, finance.contactdate, finance.responsible, finance.contact, finance.comment, finance.payday, finance.status, finance.office, finance.amount, finance.client, finance.typecoin, finance.payterm, id_login])
            return result[0]
        } catch (error) {
            console.log(error);

            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async insertExpected(finance, id_login) {
        try {
            const sql = `INSERT INTO ansa.financeexpected (client, transfUsd, chequeUsd, transfGs, chequeGs, office, date, datereg, id_login) values (?, ?, ?, ?, ?, ?, ?, now() - interval 3 hour, ?)`

            const result = await query(sql, [finance.client, finance.transfUsd, finance.chequeUsd, finance.transfGs, finance.chequeGs, finance.office, finance.date, id_login])
            return result[0]
        } catch (error) {
            console.log(error);

            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async check(finance) {
        try {
            const sql = `SELECT * FROM ansa.financeinvoice WHERE invoicenr = ? AND datereg > NOW() - interval 12 hour`
            const result = await query(sql, finance.invoicenr)

            return result[0]
        } catch (error) {

            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async listExpected(client, office) {
        try {
            let sql = `SELECT id, transfUsd, chequeUsd, transfGs, chequeGs,
            DATE_FORMAT(fi.date, '%H:%i %d/%m/%Y') as date
            FROM ansa.financeexpected
            WHERE client = ? AND office = ? `;

            const result = await query(sql, [client, office]);

            return result[0]
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las expectativas')
        }
    }

    async checkExpected(finance) {
        try {
            const sql = `SELECT * FROM ansa.financeexpected WHERE client = ? AND office = ?`
            const result = await query(sql, [finance.client, finance.office])

            return result[0]
        } catch (error) {

            throw new InvalidArgumentError(error)
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

    async updateExpected(finance) {
        try {
            const sql = `UPDATE ansa.financeexpected SET transfUsd = ?, chequeUsd = ?, transfGs = ?, chequeGs = ?, date = ?  WHERE id = ?`
            const result = await query(sql, [finance.transfUsd, finance.chequeUsd, finance.transfGs, finance.chequeGs, finance.date, finance.id])

            return result[0]
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }

    async listClient(client, d1, d2) {
        try {
            let sql = `SELECT t.SalesMan, t.date, t.CustCode, t.CustName, t.SerNr, t.daysOverdue, t.DueDate, t.amount, t.office, t.payday, t.comment, t.responsible, t.contact, t.contactdate, t.dateReg, t.status, t.typecoin, t.payterm, t.coinAmount
            FROM (SELECT DATE_FORMAT(re.date, '%H:%i %d/%m/%Y') as date, re.SalesMan, re.CustCode, re.CustName, re.SerNr, re.Office as office, IF(DATEDIFF(NOW(), re.DueDate) > 0,DATEDIFF(NOW(), re.DueDate),0)  as daysOverdue, DATE_FORMAT(re.DueDate, '%d/%m/%Y') as DueDate, IF(re.Currency = "RE", 1, IF(re.Currency = "GS", 2, 3)) as typecoin,
            TRUNCATE(SUM(IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0, 
            IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total))))),2) as amount, fi.status, IF(re.PayTerm = "Cheque", 2, 1) as payterm, re.Total as coinAmount,
            DATE_FORMAT(fi.contactdate, '%Y-%m-%d') as contactdate,if(fi.datereg > NOW() - interval 1 day , DATE_FORMAT(fi.payday, '%Y-%m-%d'), "") as payday, if(fi.datereg > NOW() - interval 1 day ,fi.comment,"") as comment, if(fi.datereg > NOW() - interval 1 day ,fi.responsible,"") as responsible, 
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

    list(clients, offices, overdue, type) {
        try {
            let sql = `SELECT re.CustCode, re.CustName, COUNT(DISTINCT re.OfficialSerNr) as invoices,

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

            if (offices && offices !== "ALL") sql += ` AND re.Office IN (${offices}) `

            if (clients && clients !== "ALL") sql += ` AND re.CustCode IN (${clients}) `

            if (type !== '3') {
                if (type === '1') {
                    sql += `AND re.PayTerm != "Cheque " `
                } else {
                    sql += `AND re.PayTerm = "Cheque " `
                }
            }

            if (overdue === '1') sql += `AND re.DueDate <= NOW() `

            sql += `GROUP BY re.CustCode `

            return query(sql)
        } catch (error) {
            console.log(error);
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

    graphReceivable(id_login, offices, datestart, dateend) {
        try {

            let sql = `SELECT 
            COUNT(fi.id_financeinvoice) as contact, DATE_FORMAT(fi.contactdate, '%d/%m/%Y') as date
            FROM ansa.financeinvoice fi
            WHERE fi.id_financeinvoice > 0  `

            if (offices) sql += ` AND fi.id_login IN ( SELECT ou.id_login FROM ansa.officeuser ou
                INNER JOIN ansa.office oi ON oi.id_office = ou.id_office
                WHERE oi.code IN (${offices})) `

            if (id_login) sql += ` AND fi.id_login = ${id_login} `

            if (datestart && dateend) {
                sql += ` AND fi.contactdate BETWEEN '${search.start}' AND '${search.end}' `
            } else {
                sql += ` AND fi.contactdate BETWEEN now() - interval 30 day AND NOW()`
            }

            sql += ` GROUP BY fi.contactdate
            ORDER BY fi.contactdate ASC`

            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

    detailsReceivable(id_login, offices, datestart = "", dateend = "") {

        try {
            let sql = `SELECT fi.* , 
            TRUNCATE(SUM(IF(re.DueDate > now(), IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as AmountOpen,
                
            TRUNCATE(SUM(IF(re.DueDate <= now(),IF(re.InvoiceType = 4, IF(re.Currency = "GS", re.Total / re.BaseRate, IF(re.Currency = "RE", re.Total * re.FromRate / re.BaseRate, re.Total)),IF(re.InvoiceType = 2,0,
            IF(re.Currency = "GS", re.Saldo / re.BaseRate, IF(re.Currency = "RE", re.Saldo * re.FromRate / re.BaseRate, re.Saldo)))), 0)),2) as AmountBalance

            FROM ansa.receivable re 
            LEFT JOIN ansa.financeinvoice fi on re.SerNr = fi.invoicenr  
            WHERE re.CustCode <> 1 `

            if (id_login) sql += ` AND fi.id_login = ${id_login} `

            if (offices) sql += ` AND re.Office IN (${offices}) `

            sql += ` GROUP BY re.id_receivable`

            return query(sql)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }

    view(office, user, type, clients) {
        try {
            let sql = `SELECT re.CustCode, re.CustName, COUNT(DISTINCT re.OfficialSerNr) as invoices,

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
            `

            if (clients == '1') sql += `, fe.id, fe.transfUsd, fe.chequeUsd, fe.transfGs, fe.chequeGs,
            DATE_FORMAT(fe.date, '%Y-%m-%d') as date `

            sql += ` FROM ansa.receivable re  `
            if (clients == '1') sql += ` LEFT JOIN financeexpected fe ON re.CustCode = fe.client and LAST_DAY(fe.date) = LAST_DAY(now())`

            sql += ` WHERE re.CustCode <> 1 `
            if (office && office !== "ALL") sql += ` AND re.Office IN (${office}) `

            if (type === '1') {
                sql += `AND re.PayTerm != "Cheque " AND re.DueDate <= NOW() `
            } else {
                sql += `AND re.PayTerm = "Cheque " `
            }

            sql += `GROUP BY re.CustCode 
                    HAVING AmountBalance > 0
                    ORDER BY AmountBalance DESC`

            return query(sql)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los datos')
        }
    }


    async listResumeOffice(arroffices, month) {
        try {
            let sql = `SELECT ofi.code, ofi.name,
            TRUNCATE(SUM(IF(fi.typecoin = 3 AND fi.payterm = 1,  amount,0)),2) AS usdTransf,
            fe.transfUsd as exUsdTransf,
            TRUNCATE(SUM(IF(fi.typecoin = 3 AND fi.payterm = 2,  amount,0)),2) AS usdCheque,
            fe.chequeUsd as exChequeUsd,
            TRUNCATE(SUM(IF(fi.typecoin = 2 AND fi.payterm = 1,  amount,0)),2) AS gsTransf,
            fe.transfGs as exTransfGs,
            TRUNCATE(SUM(IF(fi.typecoin = 2 AND fi.payterm = 2,  amount,0)),2) AS gsCheque,
            fe.chequeGs as exChequeGs
            FROM ansa.office as ofi
            LEFT JOIN ansa.financeinvoice as fi on ofi.code = fi.office and LAST_DAY(fi.contactdate) = LAST_DAY(?)
            LEFT JOIN ansa.financeexpected as fe on fi.client = fe.client and LAST_DAY(fe.date) = LAST_DAY(?)
            WHERE ofi.code <> "00" and ofi.code in (?)
            GROUP BY code, typecoin, payterm
            ORDER BY ofi.code ASC
            `

            return query(sql, [`${month}-10`, `${month}-10`, arroffices])
        } catch (error) {
            console.log(error);
            throw new InternalServerError('No se pudieron enumerar los resumen')
        }
    }
}

module.exports = new Finance()