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



    dropReceive(){
        try {
            const sql = `drop table ansa.receive`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    listNcs() { 
        
        try {
            const sql = ` SELECT 'A' as DocType,'' as Type, InvoiceType, SerNr, CONCAT(TransDate, " ", TransTime) AS date, Invoice.DueDate
            , Invoice.PayTerm, Invoice.CustCode, UPPER(Customer.Name) as CustName, Invoice.OfficialSerNr, Invoice.Currency, Invoice.SalesMan
            ,CurrencyRate, BaseRate, -Total as Total, Saldo, Invoice.Office , Invoice.FromRate
            , Invoice.Comment, Customer.GroupCode as CustGroup
            , Saldo as SaldoInv
            ,concat(per.Name,' ' ,LastName) as SalesManName 
            FROM Invoice 
            INNER JOIN Customer ON Customer.Code = Invoice.CustCode 
            LEFT JOIN DeliveryAddress da ON da.CustCode = Invoice.CustCode and da.Code = Invoice.DelAddressCode 
            LEFT JOIN Person per ON per.Code = Invoice.SalesMan 
            WHERE Invoice.Saldo != 0
            AND (Invoice.DisputedFlag = 0 OR Invoice.DisputedFlag IS NULL)
            AND Invoice.OpenFlag = 1
            AND Invoice.Status = 1 
            AND (Invalid <> 1 OR Invalid IS NULL) 
            AND InvoiceType = 1
            AND (AppliesToInvoiceNr = 0 OR AppliesToInvoiceNr IS NULL)
            AND (Installments = 0 OR Installments IS NULL) 
            ORDER BY Invoice.SerNr  `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    listInvoices() {
        try {
            const sql = `  SELECT 'A' as DocType, '' as Type, InvoiceType, SerNr, CONCAT(TransDate, " ", TransTime) AS date,
            DueDate, Invoice.PayTerm, Invoice.CustCode, UPPER(Customer.Name) as CustName, OfficialSerNr, Invoice.Currency, Invoice.SalesMan, 
            CurrencyRate, BaseRate, Total as Total, Saldo, Invoice.Office , Invoice.FromRate
            , Invoice.Comment ,Customer.GroupCode as CustGroup
            , Saldo as SaldoInv
            ,concat(per.Name,' ' ,LastName) as SalesManName 
            FROM Invoice 
            INNER JOIN Customer ON Customer.Code = Invoice.CustCode 
            LEFT JOIN DeliveryAddress da ON da.CustCode = Invoice.CustCode and da.Code = Invoice.DelAddressCode 
            LEFT JOIN Person per ON per.Code = Invoice.SalesMan 
            WHERE Invoice.Saldo != 0
            AND (Invoice.DisputedFlag = 0 OR Invoice.DisputedFlag IS NULL)
            AND Invoice.OpenFlag = 1
            AND Invoice.Status = 1 
            AND (Invalid <> 1 OR Invalid IS NULL) 
            AND InvoiceType <> 1 
            AND (Installments = 0 OR Installments IS NULL) 
            ORDER BY Invoice.SerNr `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    listInstalls() {
        try {
            const sql = `SELECT 'A' as DocType,"Installment" as Type, InvoiceType, Invoice.SerNr,MIN(InvoiceInstallRow.InstallNr) as InstallNr, CONCAT(Invoice.TransDate, " ", Invoice.TransTime) AS date,
            InvoiceInstallRow.DueDate as DueDate, OfficialSerNr, Invoice.PayTerm, Invoice.Currency as Currency,
            Invoice.CurrencyRate, Invoice.BaseRate, Invoice.CustCode, UPPER(Customer.Name) as CustName, InvoiceInstallRow.Saldo as Saldo, InvoiceInstallRow.Amount as Total,
            InvoiceInstallRow.Saldo as SaldoInv, Invoice.SalesMan, Invoice.Office, Invoice.Comment, Invoice.FromRate
            ,concat(per.Name,' ' ,LastName) as SalesManName 
            FROM InvoiceInstallRow 
            INNER JOIN Invoice ON Invoice.internalId = InvoiceInstallRow.masterId
            INNER JOIN Customer ON Customer.Code = Invoice.CustCode
            LEFT JOIN PromissoryNote ON (PromissoryNote.InvoiceNr = Invoice.SerNr AND InvoiceInstallRow.InstallNr = PromissoryNote.InvoiceInstallNr and PromissoryNote.Status = 1 and (PromissoryNote.Invalid = 0 or PromissoryNote.Invalid IS NULL))
            LEFT JOIN DeliveryAddress da ON da.CustCode = Invoice.CustCode and da.Code = Invoice.DelAddressCode
            LEFT JOIN (SELECT npn.OriginNr, npnr.InstallNr, npnr.SupCode, npnr.SupName
                FROM NegociatePromissoryNote npn inner join NegociatePromissoryNoteRow npnr on npn.internalId = npnr.masterId
                WHERE npn.Status = 1 AND (npn.Invalid = 0 OR npn.Invalid IS NULL) AND OriginType = 1) npn
                ON (Invoice.SerNr = npn.OriginNr AND InvoiceInstallRow.InstallNr = npn.InstallNr)
            LEFT JOIN Person per ON per.Code = Invoice.SalesMan 
            WHERE Invoice.Status = 1
            AND InvoiceInstallRow.OpenFlag = 1
            AND (Invoice.Invalid <> 1 OR Invoice.Invalid IS NULL) 
            AND InvoiceInstallRow.DueDate BETWEEN '2001-01-01' AND now()
            AND (Invoice.DisputedFlag = 0 OR Invoice.DisputedFlag IS NULL) 
            AND InvoiceInstallRow.DueDate BETWEEN '2001-01-01' AND '2030-01-01'
            GROUP BY InvoiceInstallRow.internalId
            ORDER BY SerNr  `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    listPurchaseOrders() {
        try {
            const sql = `  SELECT 'A' as DocType,3 as InvoiceType, SerNr,  ItemTotal, ce.Currency,ce.CurrencyRate, ce.BaseRate, ofi.Name as OfficeName, ce.TransDate as date
            , ce.CustCode, ce.CustName, ce.ItemTotal as Saldo, '' as PayTerm, ce.TransDate as DueDate, ce.ItemTotal as Total, ce.Office, '' as OfficialSerNr, '' as InstallNr
            , '' as SalesMan ,'' as SalesManName
            , '' as Comment
            FROM CupoEntry ce 
            INNER JOIN Office ofi ON ce.Office = ofi.Code
            INNER JOIN Customer ON ce.CustCode = Customer.Code 
            WHERE ce.Status = 1 AND (ce.Invalid IS NULL or ce.Invalid = 0) 
            AND ce.CupoType = 2 
            AND (ce.Invoiced = 0 or ce.Invoiced IS NULL) 
            ORDER BY SerNr  `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    listCheque() {
        try {
            const sql = ` SELECT 'B' as DocType,Cheque.Status as Type,4 InvoiceType, '' as InstallNr, Cheque.SerNr, CONCAT(Cheque.TransDate, " ", Cheque.TransTime) as date, Cheque.ExpDate DueDate, '' PayTerm, Cheque.CustCode, Cheque.CustName,
            Cheque.ChequeNr OfficialSerNr, Cheque.Currency, Cheque.BankName, Cheque.OriginCurrencyRate as FromRate, Cheque.OriginBaseRate BaseRate, Cheque.Amount Total, 0 Saldo, Cheque.Office, if(Cheque.Reentered, 'Si', 'No') Comment
            FROM Cheque
            INNER JOIN Customer ON Customer.Code = Cheque.CustCode
            left JOIN ReceiptPayModeRow rpmr on  rpmr.ChequeNr = Cheque.SerNr 
            left JOIN  Receipt ON  Receipt.internalId = rpmr.masterId and Receipt.Status = 1 
            left  JOIN  PayMode ON rpmr.PayMode = PayMode.Code AND(PayMode.PayType = 2 or PayMode.PayType = 104) 
            WHERE Cheque.Status in (1,7) 
            AND Cheque.Type  in (0,1,2) 
            group by  Cheque.SerNr
            ORDER BY SerNr
            `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    listReceipts() {
        try {
            const sql = ` SELECT  SerNr, Saldo, OnAccount.Currency,CurrencyRate as FromRate, BaseRate,Code as CustCode, Name as CustName, Comment, 
            IF( OnAccount.Currency = 'GS', Saldo/BaseRate, IF( OnAccount.Currency = 'RE', Saldo * CurrencyRate / BaseRate , Saldo)) AS SaldoInv
            FROM OnAccount
            INNER JOIN Customer on Customer.Code = Entity
            WHERE OpenFlag = 1 
            AND OnAccount.SerNr IN
            (SELECT rir.OnAccNr
            FROM ReceiptInvoiceRow rir 
            INNER JOIN Receipt r ON r.internalId = rir.masterId 
            WHERE r.Status = 1
            AND (r.Invalid = 0 or r.Invalid is NULL)
            AND rir.OnAccNr is not NULL
            )`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async insertReceivable(invoice) {
        try {
            const sql = `INSERT INTO ansa.receivable set ?`
            await query(sql, invoice)

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError(error)
        }
    }

    listSalesMan(){
        try {
            const sql = `SELECT DISTINCT SalesMan FROM SalesOrder ORDER BY SalesMan`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    listItems(){
        try {
            const sql = `SELECT Item.Code, Item.Name, Item.Price, Item.BrandCode, Item.BrandName, Label.Name AS Labels, Item.SupName, Item.SupCode 
            FROM Item  
            INNER JOIN ItemGroup ON ItemGroup.Code = Item.ItemGroup
            INNER JOIN Label ON Label.Code = Item.Labels`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }
}

module.exports = new Hbs()