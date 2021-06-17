const queryhbs = require('../infrastructure/database/querieshbs')
const query = require('../infrastructure/database/queries')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

async function formatStringDatetoCompare(data) {
    var ano = data.split("-")[2];
    var mes = data.split("-")[1];
    var dia = data.split("-")[0];

    return ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + '-' + ano;
}

class Hbs {

    listSalary() {
        try {
            const sql = ` SELECT sa.SerNr as serNr, DATE_FORMAT(sa.TransDate, '%Y-%m-%d') as date, sa.TransTime as time, sa.Office as office, sa.BaseRate as baserate, sa.CurrencyRate as currencyrate, sa.Comment as comment, 
            sa.Reference as reference, sa.Base2CreditSum as usd, sa.EmployeeName as name FROM SalaryPayment sa`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async insertSalary(salary, date) {

        try {
            const sql = `INSERT INTO ansa.salary (serNr, dateTime, office, comment, reference, usd, name) values (?, ?, ?, ?, ?, ?, ?)`
            await query(sql, [salary.serNr, date, salary.office, salary.comment, salary.reference, salary.usd, salary.name])
            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError(error)
        }

    }

    dropSalary(){
        try {
            const sql = `drop table ansa.salary`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    listUsers() {
        try {
            const sql = ` SELECT wk.Name as name,wk.Phone as phone,wk.Mobile as mobile,wk.BirthDate AS dateBirthday,wk.Code AS cod,JobName AS responsibility, wk.modality as modalidad,
            wk.StartDate AS startCompany, wk.IDNro AS document, wk.Office AS officecode, ofi.Name as officename, wk.EndDate as endCompany, wk.Sex AS sex, wk.status from Workers as wk 
            LEFT JOIN City ct ON ct.Code =  wk.BirthPl 
            LEFT JOIN Office ofi ON wk.Office = ofi.Code `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async insertUser(user) {
        try {
            const sql = `INSERT INTO ansa.user (name, perfil, dateBirthday, phone, cod, responsibility, modalidad, startCompany, document, officecode, officename, endCompany, status, sex, dateReg) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour)`
            await query(sql, [user.name, 'user hbs', user.dateBirthday, user.phone, user.cod, user.responsibility, user.modalidad, user.startCompany, user.document, user.officecode, user.officename, user.endCompany, user.status, user.sex])

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError(error)
        }
    }

    dropUsers(){
        try {
            const sql = `drop table ansa.user`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }


    listReceive() {
        try {
            const sql = ` SELECT SerNr,SalesMan,nameSalesMan,CODE AS code,NAME AS client,CustomerGroup,TransDate,Office,Days,rowNr +1 as rowNr,
            SUM(d15) AS d15,SUM(d30) AS d30 ,SUM(d60) AS d60,SUM(d90) AS d90,SUM(d120) AS d120,SUM(dm120) AS dm120,
            SUM(d15) AS d15USD,SUM(d30) AS d30USD,SUM(d60) AS d60USD,SUM(d90) AS d90USD,SUM(d120) AS d120USD,SUM(dm120) AS dm120USD,SUM(Vencido) AS Vencido,
                        DueDate,Saldo,LastPayDate AS lastPay,Currency, BaseRate, CurrencyRate, FromRate, PayTerm,
                        SUM(d15+ d30+ d60+ d90+ d120+ dm120) AS totalCurrency, Total as ttcredutilizmonorig,
                        IF(SUM(d15+ d30+ d60+ d90+ d120+ dm120) <> 0, 'S', 'N') AS status,
                        IF(Currency = "GS", SUM(d15+ d30+ d60+ d90+ d120+ dm120)/BaseRate, IF(Currency = "RE", SUM(d15+ d30+ d60+ d90+ d120+ dm120) * FromRate / BaseRate, SUM(d15+ d30+ d60+ d90+ d120+ dm120))) AS ttVencidoUsd,
                        IF(Currency = "GS", Total/BaseRate, IF(Currency = "RE", Total * FromRate / BaseRate, Total)) AS ttcredutilizuSD
                        FROM (SELECT i.SerNr,sa.SalesMan,u.name AS nameSalesMan,c.Code,c.GroupCode as CustomerGroup,i.TransDate,i.Office,c.Name,DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW()) AS Days,ir.rowNr,i.Currency,i.CurrencyRate,i.BaseRate, i.FromRate
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 0 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 15,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d15
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 15 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 30,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d30
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 30 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 60,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d60 
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 60 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 90,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d90 
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 90 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 120,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d120
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 120,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS dm120
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 0 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 15,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d15USD
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 15 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 30,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d30USD
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 30 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 60,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d60USD
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 60 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 90,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS d90USD
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 90 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 120,IF(ir.Saldo !=  0,ir.Saldo,i.Saldo ),0)) AS d120USD
                        ,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 120,IF(ir.Saldo != 0,ir.Saldo,i.Saldo ),0)) AS dm120USD
                        ,SUM(IF(DATEDIFF(ir.DueDate,NOW()) < 0,ir.Saldo,0)) AS Vencido,IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate) AS DueDate,i.Saldo,IF(i.PayTerm = "NC",i.Total * -1,i.Total ) as Total, i.PayTerm
                        ,(SELECT MAX(TransDate)  FROM Receipt r INNER JOIN ReceiptInvoiceRow rr ON rr.masterId = r.internalId WHERE rr.InvoiceNr = i.SerNr AND r.Status = 1 AND  i.OpenFlag = 1 AND (r.Invalid = 0 OR r.Invalid IS NULL)) AS LastPayDate   
                        ,it.ItemGroup 
                        FROM  Invoice i
                        INNER JOIN Customer c ON c.Code = i.CustCode  
                        LEFT JOIN InvoiceItemRow AS iir ON (iir.masterId = i.internalId AND iir.rowNr = 0)  
                        LEFT JOIN Item it ON it.Code = iir.ArtCode 
                        LEFT JOIN InvoiceInstallRow AS ir ON (ir.masterId = i.internalId AND ir.Saldo <> 0)
                        INNER JOIN SalesOrder AS sa ON (iir.OriginSerNr = sa.SerNr)
                        INNER JOIN User u ON sa.SalesMan = u.Code
                        WHERE i.Saldo != 0 AND i.STATUS = 1 AND (i.Invalid = 0 OR i.Invalid IS NULL ) AND i.OpenFlag = 1 GROUP BY i.SerNr,ir.rowNr )
                        AS a GROUP BY SerNr `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async insertReceive(receive) {
        try {
            const sql = `INSERT INTO ansa.receive set ?`
            await query(sql, receive)

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError(error)
        }
    }

    dropReceive(){
        try {
            const sql = `drop table ansa.receive`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }
}

module.exports = new Hbs()