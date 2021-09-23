const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')


class Hbs {

    lastSalary() {
        try {
            const sql = ` SELECT SerNr FROM ansa.SalaryPayment ORDER BY SerNr DESC LIMIT 1`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('La última lista de salario falló')
        }
    }

    listSalary() {
        try {
            const sql = ` SELECT sa.SerNr as serNr, DATE_FORMAT(sa.TransDate, '%Y-%m-%d') as date, sa.TransTime as time, sa.Office as office, sa.BaseRate as baserate, sa.CurrencyRate as currencyrate, sa.Comment as comment, 
            sa.Reference as reference, sa.Base2CreditSum as usd, sa.EmployeeName as name FROM SalaryPayment sa WHERE sa.TransDate > DATE_ADD(now() - interval 4 hour , INTERVAL -1 DAY)`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('La lista de salarios falló')
        }
    }

    async insertSalary(salary, date) {

        try {
            const sql = `INSERT INTO ansa.salary (serNr, dateTime, office, comment, reference, usd, name) values (?, ?, ?, ?, ?, ?, ?)`
            await query(sql, [salary.serNr, date, salary.office, salary.comment, salary.reference, salary.usd, salary.name])
            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el salario en la base de datos')
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
            throw new InternalServerError('La lista de usuarios falló')
        }
    }

    async lastClockMachine(code) {
        try {
            const sql = `SELECT DATE_FORMAT(TimestampDate, '%m-%d-%Y %H:%i:%s') as date FROM ansa.clockmachine WHERE EmployeeCode = ${code} ORDER BY TimestampDate DESC LIMIT 1`
            const data = await query(sql)

            return data[0].date
        } catch (error) {
            throw new InternalServerError('La última lista de control de punto falló')
        }
    }

    listClockMachine() {
        try {
            const sql = `SELECT cl.EmployeeCode, CONCAT(DATE_FORMAT(cl.Date, '%d/%m/%Y')," ",cl.TIME) AS Date, CONCAT(cl.Date," ",cl.TIME) AS TimestampDate, cl.InOutType AS Type, cl.Office, wo.Name
            FROM ClockMachineRecord cl
            INNER JOIN Workers wo ON cl.EmployeeCode = wo.Code`

            return queryhbs(sql)

        } catch (error) {
            console.log(error);
        }
    }

    async insertUser(user) {
        try {
            const sql = `INSERT INTO ansa.userhbs (name, perfil, dateBirthday, phone, cod, responsibility, modalidad, startCompany, document, officecode, officename, endCompany, status, sex, dateReg) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now() - interval 4 hour)`
            await query(sql, [user.name, 'user hbs', user.dateBirthday, user.phone, user.cod, user.responsibility, user.modalidad, user.startCompany, user.document, user.officecode, user.officename, user.endCompany, user.status, user.sex])

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el usuario en la base de datos')
        }
    }

    dropUsers() {
        try {
            const sql = `drop table IF EXISTS ansa.userhbs`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar la tabla userhbs')
        }
    }



    dropReceivable() {
        try {
            const sql = `drop table IF EXISTS ansa.receivable`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo borrar la tabla receivable')
        }
    }

    createTableUsersHbs() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS userhbs (id_user int NOT NULL AUTO_INCREMENT,name VARCHAR (100) NOT NULL, perfil int NOT NULL, phone VARCHAR (45), cod INT, responsibility VARCHAR (75),
            modalidad VARCHAR (45), startCompany DATE, document VARCHAR (45), officecode INT, officename VARCHAR(45), endCompany DATE, sex VARCHAR(10),
            dateBirthday DATE, status int NOT NULL, dateReg DATETIME NOT NULL, id_office VARCHAR(10), PRIMARY KEY (id_user))`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo crear la tabla userhbs')
        }
    }

    createTableReceivable() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS ansa.receivable (id_receivable int NOT NULL AUTO_INCREMENT, SerNr double, date DATETIME, DueDate date,
                InstallNr VARCHAR (25), InvoiceType VARCHAR (5), Type VARCHAR (15), SaldoInv double, DocType VARCHAR (45), FromRate double,
                SalesMan VARCHAR (250), SalesManName VARCHAR (250), CustCode int, PayTerm VARCHAR (10), CustName VARCHAR (150), OfficialSerNr VARCHAR (100), 
                Currency VARCHAR (5),  CurrencyRate double, BaseRate double,  Total double, BankName varchar(25),
                Saldo double, Office VARCHAR(5), Comment VARCHAR (250), CustGroup VARCHAR (15), PRIMARY KEY (id_receivable))`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo crear la tabla receivable')
        }
    }

    listNcs() {

        try {
            const sql = `  SELECT 'A' as DocType,'' as Type, InvoiceType, Invoice.SerNr, CONCAT(Invoice.TransDate, " ", Invoice.TransTime) AS date, Invoice.DueDate
            , Invoice.PayTerm, Invoice.CustCode, UPPER(Customer.Name) as CustName, Invoice.OfficialSerNr, Invoice.Currency, IF(SalesOrder.SalesMan = "GERENTE13", "SANTIAGO", SalesOrder.SalesMan) AS SalesMan
            ,Invoice.CurrencyRate, Invoice.BaseRate, -Invoice.Total as Total, Saldo, Invoice.Office , Invoice.FromRate
            , Invoice.Comment, Customer.GroupCode as CustGroup
            , Saldo as SaldoInv
            ,IF(SalesOrder.SalesMan = "GERENTE13","SANTIAGO MARIANO ROQUE ALONSO",concat(per.Name,' ' ,LastName)) as SalesManName 
            FROM Invoice 
            INNER JOIN InvoiceItemRow ON InvoiceItemRow.masterId = Invoice.internalId
            INNER JOIN SalesOrder ON SalesOrder.SerNr = InvoiceItemRow.OriginSerNr
            INNER JOIN Customer ON Customer.Code = Invoice.CustCode 
            LEFT JOIN DeliveryAddress da ON da.CustCode = Invoice.CustCode and da.Code = Invoice.DelAddressCode 
            LEFT JOIN Person per ON per.Code = SalesOrder.SalesMan 
            WHERE Invoice.Saldo != 0
            AND (Invoice.DisputedFlag = 0 OR Invoice.DisputedFlag IS NULL)
            AND Invoice.OpenFlag = 1
            AND Invoice.Status = 1 
            AND (Invoice.Invalid <> 1 OR Invoice.Invalid IS NULL) 
            AND InvoiceType = 1
            AND (AppliesToInvoiceNr = 0 OR AppliesToInvoiceNr IS NULL)
            AND (Installments = 0 OR Installments IS NULL) 
            AND Invoice.CustCode NOT IN (126911475, 283, 200430, 23591869, 23594956, 126922160, 126911475, 661, 716, 1, 128414, 717, 4)
            ORDER BY Invoice.SerNr  `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar ncs')
        }
    }

    listInvoices() {
        try {
            const sql = ` SELECT 'A' as DocType, '' as Type, InvoiceType, Invoice.SerNr, CONCAT(Invoice.TransDate, " ", Invoice.TransTime) AS date,
            Invoice.DueDate, Invoice.PayTerm, Invoice.CustCode, UPPER(Customer.Name) as CustName, OfficialSerNr, Invoice.Currency, IF(SalesOrder.SalesMan = "GERENTE13", "SANTIAGO", SalesOrder.SalesMan) AS SalesMan, 
            Invoice.CurrencyRate, Invoice.BaseRate, Invoice.Total as Total, Saldo, Invoice.Office , Invoice.FromRate
            , Invoice.Comment ,Customer.GroupCode as CustGroup
            , Saldo as SaldoInv
            ,IF(SalesOrder.SalesMan = "GERENTE13","SANTIAGO MARIANO ROQUE ALONSO",concat(per.Name,' ' ,LastName)) as SalesManName 
            FROM Invoice 
            INNER JOIN InvoiceItemRow ON InvoiceItemRow.masterId = Invoice.internalId
            INNER JOIN SalesOrder ON SalesOrder.SerNr = InvoiceItemRow.OriginSerNr
            INNER JOIN Customer ON Customer.Code = Invoice.CustCode 
            LEFT JOIN DeliveryAddress da ON da.CustCode = Invoice.CustCode and da.Code = Invoice.DelAddressCode 
            LEFT JOIN Person per ON per.Code = SalesOrder.SalesMan 
            WHERE Invoice.Saldo != 0
            AND (Invoice.DisputedFlag = 0 OR Invoice.DisputedFlag IS NULL)
            AND Invoice.OpenFlag = 1
            AND Invoice.Status = 1 
            AND (Invoice.Invalid <> 1 OR Invoice.Invalid IS NULL) 
            AND InvoiceType <> 1 
            AND (Installments = 0 OR Installments IS NULL) 
            AND Invoice.CustCode NOT IN (126911475, 283, 200430, 23591869, 23594956, 126922160, 126911475, 661, 716, 1, 128414, 717, 4)
            ORDER BY Invoice.SerNr`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar facturas')
        }
    }

    listInstalls() {
        try {
            const sql = `SELECT 'A' as DocType,"Installment" as Type, InvoiceType, Invoice.SerNr,MIN(InvoiceInstallRow.InstallNr) as InstallNr, CONCAT(Invoice.TransDate, " ", Invoice.TransTime) AS date,
            InvoiceInstallRow.DueDate as DueDate, OfficialSerNr, Invoice.PayTerm, Invoice.Currency as Currency,
            Invoice.CurrencyRate, Invoice.BaseRate, Invoice.CustCode, UPPER(Customer.Name) as CustName, InvoiceInstallRow.Saldo as Saldo, InvoiceInstallRow.Amount as Total,
            InvoiceInstallRow.Saldo as SaldoInv, IF(SalesOrder.SalesMan = "GERENTE13", "SANTIAGO", SalesOrder.SalesMan) AS SalesMan, Invoice.Office, Invoice.Comment, Invoice.FromRate
            ,IF(SalesOrder.SalesMan = "GERENTE13","SANTIAGO MARIANO ROQUE ALONSO",concat(per.Name,' ' ,LastName)) as SalesManName  
            FROM InvoiceInstallRow 
            INNER JOIN Invoice ON Invoice.internalId = InvoiceInstallRow.masterId
            INNER JOIN InvoiceItemRow ON InvoiceItemRow.masterId = Invoice.internalId
            INNER JOIN SalesOrder ON SalesOrder.SerNr = InvoiceItemRow.OriginSerNr
            INNER JOIN Customer ON Customer.Code = Invoice.CustCode
            LEFT JOIN PromissoryNote ON (PromissoryNote.InvoiceNr = Invoice.SerNr AND InvoiceInstallRow.InstallNr = PromissoryNote.InvoiceInstallNr and PromissoryNote.Status = 1 and (PromissoryNote.Invalid = 0 or PromissoryNote.Invalid IS NULL))
            LEFT JOIN DeliveryAddress da ON da.CustCode = Invoice.CustCode and da.Code = Invoice.DelAddressCode
            LEFT JOIN (SELECT npn.OriginNr, npnr.InstallNr, npnr.SupCode, npnr.SupName
                FROM NegociatePromissoryNote npn inner join NegociatePromissoryNoteRow npnr on npn.internalId = npnr.masterId
                WHERE npn.Status = 1 AND (npn.Invalid = 0 OR npn.Invalid IS NULL) AND OriginType = 1) npn
                ON (Invoice.SerNr = npn.OriginNr AND InvoiceInstallRow.InstallNr = npn.InstallNr)
            LEFT JOIN Person per ON per.Code = SalesOrder.SalesMan 
            WHERE Invoice.Status = 1
            AND InvoiceInstallRow.OpenFlag = 1
            AND (Invoice.Invalid <> 1 OR Invoice.Invalid IS NULL) 
            AND (Invoice.DisputedFlag = 0 OR Invoice.DisputedFlag IS NULL) 
            AND Invoice.CustCode NOT IN (126911475, 283, 200430, 23591869, 23594956, 126922160, 126911475, 661, 716, 1, 128414, 717, 4)
            AND InvoiceInstallRow.DueDate BETWEEN '2001-01-01' AND '2030-01-01'
            GROUP BY InvoiceInstallRow.internalId
            ORDER BY SerNr `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar facturas c/ cotas')
        }
    }

    // listPurchaseOrders() {
    //     try {
    //         const sql = `  SELECT 'A' as DocType,3 as InvoiceType, SerNr,  ItemTotal, ce.Currency,ce.CurrencyRate, ce.BaseRate, ofi.Name as OfficeName, ce.TransDate as date
    //         , ce.CustCode, ce.CustName, ce.ItemTotal as Saldo, '' as PayTerm, ce.TransDate as DueDate, ce.ItemTotal as Total, ce.Office, '' as OfficialSerNr, '' as InstallNr
    //         , '' as SalesMan ,'' as SalesManName
    //         , '' as Comment
    //         FROM CupoEntry ce 
    //         INNER JOIN Office ofi ON ce.Office = ofi.Code
    //         INNER JOIN Customer ON ce.CustCode = Customer.Code 
    //         WHERE ce.Status = 1 AND (ce.Invalid IS NULL or ce.Invalid = 0) 
    //         AND ce.CupoType = 2 
    //         AND (ce.Invoiced = 0 or ce.Invoiced IS NULL) 
    //         ORDER BY SerNr  `
    //         return queryhbs(sql)
    //     } catch (error) {
    //         throw new InternalServerError(error)
    //     }
    // }

    listCheque() {
        try {
            const sql = ` SELECT 'B' as DocType,Cheque.Status as Type,4 InvoiceType, '0' as InstallNr, Cheque.SerNr, CONCAT(Cheque.TransDate, " ", Cheque.TransTime) as date, Cheque.ExpDate DueDate, 'Cheque ' as PayTerm, Cheque.CustCode, Cheque.CustName,
            Cheque.ChequeNr OfficialSerNr, Cheque.Currency, Cheque.BankName, Cheque.OriginCurrencyRate as FromRate, Cheque.OriginBaseRate BaseRate, Cheque.Amount Total, 0 Saldo, Cheque.Office, if(Cheque.Reentered, 'Si', 'No') Comment
            FROM Cheque
            INNER JOIN Customer ON Customer.Code = Cheque.CustCode
            left JOIN ReceiptPayModeRow rpmr on  rpmr.ChequeNr = Cheque.SerNr 
            left JOIN  Receipt ON  Receipt.internalId = rpmr.masterId and Receipt.Status = 1 
            left  JOIN  PayMode ON rpmr.PayMode = PayMode.Code AND(PayMode.PayType = 2 or PayMode.PayType = 104) 
            WHERE Cheque.Status in (1,7) 
            AND Cheque.Type  in (0,1,2) 
            AND Cheque.CustCode NOT IN (126911475, 283, 200430, 23591869, 23594956, 126922160, 126911475, 661, 716, 1, 128414, 717, 4)
            group by  Cheque.SerNr
            ORDER BY SerNr
            `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar cheques')
        }
    }

    // listReceipts() {
    //     try {
    //         const sql = ` SELECT  SerNr, Saldo, OnAccount.Currency,CurrencyRate as FromRate, BaseRate,Code as CustCode, Name as CustName, Comment, 
    //         IF( OnAccount.Currency = 'GS', Saldo/BaseRate, IF( OnAccount.Currency = 'RE', Saldo * CurrencyRate / BaseRate , Saldo)) AS SaldoInv
    //         FROM OnAccount
    //         INNER JOIN Customer on Customer.Code = Entity
    //         WHERE OpenFlag = 1 
    //         AND OnAccount.SerNr IN
    //         (SELECT rir.OnAccNr
    //         FROM ReceiptInvoiceRow rir 
    //         INNER JOIN Receipt r ON r.internalId = rir.masterId 
    //         WHERE r.Status = 1
    //         AND (r.Invalid = 0 or r.Invalid is NULL)
    //         AND rir.OnAccNr is not NULL
    //         )`
    //         return queryhbs(sql)
    //     } catch (error) {
    //         throw new InternalServerError(error)
    //     }
    // }

    listSalesOrder(search) {
        try {
            let sql = `SELECT SO.SerNr,CONCAT(DATE_FORMAT(SO.TransTime, '%H:%i'), " ", DATE_FORMAT(SO.TransDate, '%d/%m/%Y')) AS date,SO.CustCode,SO.CustName,TRUNCATE(SO.Total,2) as Total,TRUNCATE(SO.SubTotal,2) as SubTotal,SO.Invalid,SO.Closed,SO.Status,
            SOIr.ArtCode, SOIr.Name, SOIr.Labels, SOIr.Qty, TRUNCATE(SOIr.Price,2) as Price, TRUNCATE(SOIr.RowNet,2) as RowNet, TRUNCATE(SOIr.RowTotal,2) as RowTotal,
            SO.Currency, SO.CurrencyRate, SO.BaseRate,CONCAT(pe.Name,' ',pe.LastName) as SalesMan,
            TRUNCATE(IF(SO.Currency = "GS", SO.Total / SO.BaseRate, IF(SO.Currency = "RE", SO.Total  * SO.FromRate / SO.BaseRate, SO.Total)),2) AS totalUsd,
            TRUNCATE(IF(SO.Currency = "GS", SO.SubTotal / SO.BaseRate, IF(SO.Currency = "RE", SO.SubTotal  * SO.FromRate / SO.BaseRate, SO.SubTotal)),2) AS subtotalUsd,`

            sql += `(SELECT TRUNCATE(SUM(IF(SO.Currency = "GS", SO.Total / SO.BaseRate, IF(SO.Currency = "RE", SO.Total  * SO.FromRate / SO.BaseRate, SO.Total))),2)
                    FROM SalesOrder SO
                    WHERE (SO.Closed = 0 OR SO.Closed IS NULL)
                    AND (SO.Invalid = 0 OR SO.Invalid IS NULL) `

            if (search.datestart != "ALL" && search.dateend != "ALL") sql += `AND TransDate >= '${search.datestart}' AND TransDate <= '${search.dateend}' `

            if (search.salesman != "ALL") sql += `AND SO.SalesMan IN (${search.salesman}) `

            if (search.office != "ALL") sql += `AND SO.Office IN (${search.office}) `

            sql += `) AS sumAmount`

            sql += ` FROM SalesOrder SO 
            INNER JOIN SalesOrderItemRow SOIr ON SOIr.masterId = SO.internalId 
            INNER JOIN Customer C ON C.Code = SO.CustCode 
            LEFT JOIN Person pe ON pe.Code = SO.SalesMan 
            WHERE (SO.Closed = 0 OR SO.Closed IS NULL) 
            AND (SO.Invalid = 0 OR SO.Invalid IS NULL) `

            if (search.datestart != "ALL" && search.dateend != "ALL") sql += `AND TransDate >= '${search.datestart}' AND TransDate <= '${search.dateend}' `

            if (search.salesman != "ALL") sql += `AND SO.SalesMan IN (${search.salesman}) `

            if (search.office != "ALL") sql += `AND SO.Office IN (${search.office}) `

            sql += `ORDER BY SO.TransDate,SO.TransTime`
            console.log(sql);
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
            throw new InvalidArgumentError('No se pudo ingresar el receivable en la base de datos')
        }
    }

    async insertClockMachine(data) {
        try {
            const sql = `INSERT INTO ansa.clockmachine set ?`
            await query(sql, data)

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el clockmachine en la base de datos')
        }
    }

    listSalesMan() {
        try {
            const sql = `SELECT DISTINCT Sa.SalesMan as code, Us.Name as name, Us.Office as office FROM SalesOrder Sa LEFT JOIN User Us ON Sa.SalesMan = Us.Code WHERE ( Us.Closed = 0 OR Us.Closed IS NULL) AND Us.Office IS NOT NULL GROUP BY Us.Code ORDER BY SalesMan `
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar SalesMan')
        }
    }

    listItems(search) {
        try {
            let sql = `SELECT IG.Name AS ItemGroup, I.Code as ArtCode,
            I.Name as ItemName, sum(St.Qty) AS StockQty, SUM(St.Reserved) AS Reserved
           FROM Item I
           INNER JOIN ItemGroup IG ON I.ItemGroup = IG.CODE
           INNER JOIN Stock St ON I.Code = St.ArtCode
           WHERE (I.Closed = 0 OR I.Closed IS NULL )`

            sql += `AND St.StockDepo IN (${search.stock}) `
            sql += `AND I.Code IN (${search.artcode}) `
            if (search.itemgroup.length > 0) sql += `AND IG.Name IN (${search.itemgroup}) `
            if (search.itemname) sql += `AND I.Name LIKE '%${search.itemname}%' `
            if (search.stockart < 1) sql += `AND St.Qty > 0 `

            sql += ` 
            GROUP BY I.Code
            ORDER BY I.Code DESC`

            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar articulos')
        }
    }


    listItemsComplete(stocks) {
        try {
            let sql = `SELECT  P.ArtCode, I.Name as ItemName
            FROM Price P
            INNER JOIN Item I ON P.ArtCode = I.CODE
            INNER JOIN Stock St ON St.ArtCode = I.Code
             WHERE (I.Closed = 0 OR I.Closed IS NULL )
             and St.StockDepo IN (${stocks})
             GROUP BY P.ArtCode
             ORDER BY P.ArtCode DESC`

            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar articulos')
        }
    }

    async listItemsLabel(code) {
        try {
            let sql = `SELECT sum(St.Qty) AS StockQty, SUM(St.Reserved) AS Reserved
                        FROM Item I
                        INNER JOIN ItemGroup Ig ON I.ItemGroup = Ig.Code
                        INNER JOIN Label La ON I.Labels = La.Code
                        INNER JOIN Stock St ON I.Code = St.ArtCode
            WHERE I.Code = "${code}"`

            const data = await queryhbs(sql)

            if (data[0].StockQty > 0) return data

        } catch (error) {
            return { StockQty: 0, Reserved: 0 }
        }
    }

    async listItemsStock(code, arrstock) {
        try {
            let sql = `SELECT sum(St.Qty) AS Qty, sum(St.Reserved) AS Reserved,
            (SELECT sum(St.Qty) FROM Item I INNER JOIN Stock St ON I.Code = St.ArtCode WHERE St.StockDepo IN (${arrstock}) AND I.Code = "${code}") AS CityQty,
            (SELECT sum(St.Reserved) FROM Item I INNER JOIN Stock St ON I.Code = St.ArtCode WHERE St.StockDepo IN (${arrstock}) AND I.Code = "${code}") AS CityReserved
            FROM Item I
            INNER JOIN ItemGroup Ig ON I.ItemGroup = Ig.Code
            INNER JOIN Label La ON I.Labels = La.Code
            INNER JOIN Stock St ON I.Code = St.ArtCode
            WHERE I.Code = "${code}"`
            const data = await queryhbs(sql)

            if (data[0].Qty > 0) return data[0]

            return { Qty: 0, Reserved: 0, CityQty: 0, CityReserved: 0 }
        } catch (error) {
            return { Qty: 0, Reserved: 0, CityQty: 0, CityReserved: 0 }
        }
    }

    listPrice(search) {
        try {
            let sql = `SELECT PDr.PriceList, IG.Name AS ItemGroup, I.Code as ArtCode, 
            I.Name as ItemName, P.Price
                       FROM PriceDealRow PDr 
                       INNER JOIN Price P ON P.PriceList = PDr.PriceList 
                       INNER JOIN PriceDeal PD ON PD.internalId = PDr.masterId
                       INNER JOIN PriceList PL on PL.Code = PDr.PriceList
                       INNER JOIN Item I ON P.ArtCode = I.Code
                       INNER JOIN ItemGroup IG ON I.ItemGroup = IG.Code
                       WHERE (I.Closed = 0 OR I.Closed IS NULL ) `

            if (search.pricelist) sql += `AND PDr.PriceList = '${search.pricelist}' `
            if (search.artcode) sql += `AND P.ArtCode LIKE '%${search.artcode}%' `
            if (search.itemgroup.length > 0) sql += `AND IG.Name IN (${search.itemgroup}) `
            if (search.itemname) sql += `AND I.Name LIKE '%${search.itemname}%' `

            sql += ` 
            GROUP BY I.Code
            ORDER BY I.Code DESC `

            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar precios')
        }
    }

    listGoodyear(search) {
        try {
            let sql = `
            SELECT I.Code as ArtCode, I.Name as ItemName, sum(St.Qty) AS StockQty, SUM(St.Reserved) AS Reserved
            FROM Item I
            INNER JOIN Stock St ON I.Code = St.ArtCode
            INNER JOIN StockDepo Sd ON St.StockDepo = Sd.Code
            INNER JOIN ItemGroup Ig ON Ig.Code = I.ItemGroup
            WHERE (I.Closed = 0 OR I.Closed IS NULL )
            AND Ig.Name IN ('CAMION', 'PASSEIO', 'UTILITARIO') `

            if (search.office.length > 0) sql += `AND Sd.Office IN (${search.office}) `

            sql += ` 
            AND I.SupCode = '331'             
            GROUP BY I.Code
            ORDER BY I.Code`

            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar articulos goodyear')
        }
    }

    listGoodyearSales(search) {
        try {
            let sql = `
            SELECT I.Code as ArtCode, I.Name as ItemName, sum(It.Qty) AS SalesQty
            FROM Item I
            LEFT JOIN InvoiceItemRow It ON I.Code = It.ArtCode
            LEFT JOIN Invoice Iv ON Iv.internalId = It.masterId
            INNER JOIN ItemGroup Ig ON Ig.Code = I.ItemGroup
            WHERE Ig.Name IN ('CAMION', 'PASSEIO', 'UTILITARIO') `

            if (search.datestart && search.dateend) sql += `AND Iv.TransDate between '${search.datestart}' and '${search.dateend}' `
            if (search.office.length > 0) sql += `AND Iv.Office IN (${search.office}) `

            sql += ` 
            AND I.SupCode = '331'         
            GROUP BY I.Code
            ORDER BY I.Code`

            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar articulos goodyear')
        }
    }

    async insertItems(item) {
        try {
            const sql = `INSERT INTO ansa.items set ?`
            await query(sql, item)

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el items en la base de datos')
        }
    }

    listStocks(id_login) {
        try {
            const sql = `SELECT name as StockDepo FROM ansa.stock WHERE id_login = ${id_login}`
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    listStocksHbs() {
        try {
            const sql = `SELECT StockDepo FROM Stock WHERE (Qty - Reserved) > 0 AND Qty IS NOT null  group BY StockDepo`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    listItemGroup(stocks) {

        try {
            const sql = `SELECT Ig.Name FROM ItemGroup Ig
            INNER JOIN Item I ON Ig.Code = I.ItemGroup
            INNER JOIN Stock St ON St.ArtCode = I.Code
            WHERE St.StockDepo IN (${stocks})
            AND Ig.Name IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
            GROUP BY Ig.Name`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Grupo de Artículos')
        }
    }

    listStockbyItem(artcode) {
        try {
            const sql = `SELECT StockDepo, 
            sum(Qty) AS Qty, SUM(Reserved) AS Reserved
            FROM Stock WHERE ArtCode = '${artcode}' AND IF(Reserved IS NOT NULL, Qty - Reserved, Qty ) > 0
            group BY StockDepo`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    listItemsGroups() {
        try {
            const sql = `SELECT distinct ig.Code, ig.Name
            FROM ItemGroup ig
            INNER JOIN Item i ON ig.Code = i.ItemGroup
            INNER JOIN Stock st ON st.ArtCode = i.Code
            WHERE st.Qty > 0
            AND ig.Name NOT IN ('ACCESORIOS', 'ACCESORIOS AUTOS', 'KLL', 'BICICLETA', 'CAFETERIA', 'KART Y AVION', 'LENTES', 'LIVRE', 'LONAS', 'PNEUS MOTOS BRASIL', 'ROPA GOODYEAR', 'ROPAS Y ACCESORIOS', 'UNIFORME')
            GROUP BY ig.Name`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    async listSaleByItem(artcode, salesman) {

        try {
            const sql = `SELECT 
            SUM(IF(MONTH(Sa.TransDate) = (MONTH(NOW()- interval 1 MONTH)),Sr.Qty,0)) AS goal1, DATE_FORMAT(NOW() - INTERVAL 1 month, '%m/%Y') AS month1,
            SUM(IF(MONTH(Sa.TransDate) = (MONTH(NOW()- interval 2 MONTH)),Sr.Qty,0)) AS goal2, DATE_FORMAT(NOW() - INTERVAL 2 month, '%m/%Y') AS month2,
            SUM(IF(MONTH(Sa.TransDate) = (MONTH(NOW()- interval 3 MONTH)),Sr.Qty,0)) AS goal3, DATE_FORMAT(NOW() - INTERVAL 3 month, '%m/%Y') AS month3
            FROM SalesOrder Sa
            INNER JOIN SalesOrderItemRow Sr ON Sa.internalId = Sr.masterId 
            WHERE Sr.ArtCode = ${artcode}
            AND Sa.SalesMan = '${salesman.code}'`

            const data = await queryhbs(sql)
            return data[0]
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    listItemPrice() {
        try {
            const sql = `SELECT pr.ArtCode as code, pr.PriceList, MIN(pr.Price) as price
            FROM (SELECT * FROM Price ORDER BY Price ASC) AS pr
            INNER JOIN Item it ON pr.ArtCode = it.Code
            INNER JOIN ItemGroup ig ON it.ItemGroup = ig.Code
            WHERE ig.Name IN ('ACTIOL', 'AGRICOLA', 'CAMARAS', 'CAMION', 'DOTE', 'LLANTA', 'LUBRIFICANTE', 'MOTO', 'OTR', 'PASSEIO', 'PICO Y PLOMO', 'PROTECTOR', 'RECAPADO', 'UTILITARIO', 'XTIRE')
            GROUP BY ArtCode
            ORDER BY pr.ArtCode ASC`

            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar prices')
        }
    }

    listClocksOffice() {
        try {
            const sql = `SELECT Office, PortNr, IPAddress, Password FROM PayRollSettingsZKclockOfficeIPRow`
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }

    listInvoiceItems(invoice) {
        try {
            const sql = `SELECT ir.Artcode AS code, ir.Name AS name, ir.Labels AS label, ir.Qty AS qty, TRUNCATE(ir.Price,2) AS price, TRUNCATE(ir.Qty * ir.Price,2) as priceamount FROM InvoiceItemRow ir
            INNER JOIN Invoice iv ON iv.internalId = ir.masterId
            WHERE iv.SerNr = ?`
            return queryhbs(sql, invoice)
        } catch (error) {
            throw new InternalServerError('No se pudo enumerar Stock')
        }
    }
}

module.exports = new Hbs()