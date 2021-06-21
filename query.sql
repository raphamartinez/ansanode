#SQL para listar personas

SELECT wk.Name,wk.Phone,wk.Mobile,wk.BirthDate AS Cumpleanos,wk.Code AS Legajo,JobName AS Cargo, wk.modality as Modalidad, wk.EmployeeKind,
wk.StartDate AS InicioEmpresa, wk.IDNro AS Cedula, wk.Office AS SucCode, ofi.Name as Sucursal, wk.EndDate, wk.Sex AS SexCode from Workers as wk 
LEFT JOIN City ct ON ct.Code =  wk.BirthPl 
LEFT JOIN Office ofi ON wk.Office = ofi.Code 


#SQL para listar salarios

SELECT jm.SerNr,jm.EmployeeCode,jm.EmployeeName,jm.WorkDepCode,jm.WorkDepName,jm.JobName,jm.Office,jm.Status,jm.ActiveFlag,jm.TransDate,jm.Amount 
FROM JobMovement jm INNER JOIN Workers w on  w.Code = jm.EmployeeCode


#salario

SELECT sa.SerNr, sa.TransDate, sa.TransTime, sa.Office, sa.BaseRate, sa.CurrencyRate, sa.Comment, sa.Reference, sa.Base2CreditSum, sa.EmployeeCode, sa.EmployeeName FROM SalaryPayment sa


#Contas a Receber

SELECT SerNr,SalesMan,Code,Name,CustomerGroup,TransDate,Office,Days,rowNr,SUM(d15) AS d15,SUM(d30) AS d30 ,SUM(d60) AS d60,SUM(d90) AS d90,SUM(d120) AS d120,SUM(dm120) AS dm120,SUM(Vencido) AS Vencido,
ItemGroup,DueDate,Saldo,itemDesc,Total,LastPayDate,Currency,CurrencyRate,BaseRate FROM (SELECT i.SerNr,i.Salesman,c.Code,c.GroupCode as CustomerGroup,i.TransDate,i.Office,c.Name,DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW()) AS Days,ir.rowNr,i.Currency,i.CurrencyRate,i.BaseRate
,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 0 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 15,IF(ir.Saldo > 0,ir.Saldo,i.Saldo ),0)) AS d15
,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 15 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 30,IF(ir.Saldo > 0,ir.Saldo,i.Saldo ),0)) AS d30
,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 30 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 60,IF(ir.Saldo > 0,ir.Saldo,i.Saldo ),0)) AS d60 
,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 60 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 90,IF(ir.Saldo > 0,ir.Saldo,i.Saldo ),0)) AS d90 
,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 90 AND DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 <= 120,IF(ir.Saldo > 0,ir.Saldo,i.Saldo ),0)) AS d120
,SUM(IF(DATEDIFF(IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate),NOW())*-1 > 120,IF(ir.Saldo > 0,ir.Saldo,i.Saldo ),0)) AS dm120
,SUM(IF(DATEDIFF(ir.DueDate,NOW()) < 0,ir.Saldo,0)) AS Vencido,IF(ir.DueDate IS NULL,i.DueDate,ir.DueDate) AS DueDate,i.Saldo,iir.Name AS itemDesc,i.Total 
,(SELECT MAX(TransDate)  FROM Receipt r INNER JOIN ReceiptInvoiceRow rr ON rr.masterId = r.internalId WHERE rr.InvoiceNr = i.SerNr AND r.Status = 1 AND (r.Invalid = 0 OR r.Invalid IS NULL)) AS LastPayDate   
,it.ItemGroup 
FROM  Invoice i 
INNER JOIN Customer c ON c.Code = i.CustCode  
LEFT JOIN InvoiceItemRow AS iir ON (iir.masterId = i.internalId AND iir.rowNr = 0)  
LEFT JOIN Item it ON it.Code = iir.ArtCode 
LEFT JOIN InvoiceInstallRow AS ir ON (ir.masterId = i.internalId AND ir.Saldo > 0)   
WHERE i.Saldo > 10 AND i.STATUS = 1 AND (i.Invalid = 0 OR i.Invalid IS NULL ) GROUP BY i.SerNr,ir.rowNr )
AS a GROUP BY SerNr




#ncs ------------ OK
SELECT 'A' as DocType,'' as Type, InvoiceType, SerNr, CONCAT(TransDate, " ", TransTime) AS date, DueDate,
, Invoice.PayTerm, Invoice.CustCode, UPPER(Customer.Name) as CustName, OfficialSerNr, Invoice.Currency, Invoice.SalesMan, 
CurrencyRate, BaseRate, -Total as Total, Saldo, Invoice.Office 
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
AND Invoice.DueDate < now()
AND Invoice.Status = 1 
AND (Invalid<> 1 OR Invalid IS NULL) 
AND InvoiceType <> 1
AND (Installments = 0 OR Installments IS NULL) 
ORDER BY Invoice.SerNr

#invoices -------------- ok
SELECT 'A' as DocType, '' as Type, InvoiceType, SerNr, CONCAT(TransDate, " ", TransTime) AS date,
DueDate, Invoice.PayTerm, Invoice.CustCode, UPPER(Customer.Name) as CustName, OfficialSerNr, Invoice.Currency, Invoice.SalesMan, 
CurrencyRate, BaseRate, Total as Total, Saldo, Invoice.Office 
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
AND Invoice.DueDate < now()
AND Invoice.Status = 1 
AND (Invalid <> 1 OR Invalid IS NULL) 
AND InvoiceType <> 1 
AND (Installments = 0 OR Installments IS NULL) 
ORDER BY Invoice.SerNr


#installs ------------- ok
SELECT 'A' as DocType,"Installment" as Type, InvoiceType, SerNr,InstallNr, CONCAT(TransDate, " ", TransTime) AS date,
InvoiceInstallRow.DueDate as DueDate, OfficialSerNr, Invoice.PayTerm, Invoice.Currency as Currency,
CurrencyRate, BaseRate, Invoice.CustCode, UPPER(Customer.Name) as CustName, InvoiceInstallRow.Saldo as Saldo,
Invoice.Saldo as SaldoInv, Amount as Total,Invoice.SalesMan, Invoice.Office, Invoice.Comment
,concat(per.Name,' ' ,LastName) as SalesManName 
FROM InvoiceInstallRow 
INNER JOIN Invoice ON Invoice.internalId = InvoiceInstallRow.masterId
INNER JOIN Customer ON Customer.Code = Invoice.CustCode
LEFT JOIN DeliveryAddress da ON da.CustCode = Invoice.CustCode and da.Code = Invoice.DelAddressCode
LEFT JOIN Person per ON per.Code = Invoice.SalesMan 
WHERE Invoice.Status = 1
AND InvoiceInstallRow.OpenFlag = 1
AND (Invoice.Invalid <> 1 OR Invoice.Invalid IS NULL) 
AND InvoiceInstallRow.DueDate BETWEEN '2001-01-01' AND now()
AND (Invoice.DisputedFlag = 0 OR Invoice.DisputedFlag IS NULL) 
ORDER BY SerNr

#PurchaseOrders ------------ ok
SELECT 'A' as DocType,3 as InvoiceType, SerNr,  ItemTotal, ce.Currency,ce.CurrencyRate, ce.BaseRate, ofi.Name as OfficeName, ce.TransDate 
, ce.CustCode, ce.CustName, ce.ItemTotal as Saldo, '' as PayTerm, ce.TransDate as DueDate, ce.ItemTotal as Total, ce.Office, '' as OfficialSerNr, '' as InstallNr
, '' as SalesMan ,'' as SalesManName
, '' as Comment,'' as CustGroup
, 0 as SaldoInv
FROM CupoEntry ce 
INNER JOIN Office ofi ON ce.Office = ofi.Code
INNER JOIN Customer ON ce.CustCode = Customer.Code 
WHERE ce.Status = 1 AND (ce.Invalid IS NULL or ce.Invalid = 0) 
AND ce.CupoType = 2 
AND (ce.Invoiced = 0 or ce.Invoiced IS NULL) 
ORDER BY SerNr





# retro



         (SELECT SUM(nc.Total)
         FROM [:1] AS nc  
         WHERE (nc.AppliesToInvoiceNr IS NOT NULL OR nc.AppliesToInvoiceNr <> 0)
         AND nc.Status = 1 AND (nc.Invalid = 0 OR nc.Invalid IS NULL)
         AND nc.%s <= d|%s| %(self.TransDateField,record.ToDate)
         AND nc.AppliesToInvoiceNr = [inv].SerNr
         AND nc.InvoiceType = 1
         )
         
         (SELECT SUM(-nci.Amount)
         FROM [:1] AS nc
         INNER JOIN  InvoiceInstallRow nci ON `nc`.`internalId` = `nci`.`masterId`
         WHERE (nc.AppliesToInvoiceNr IS NOT NULL OR nc.AppliesToInvoiceNr <> 0)
         AND nc.DueDate <= '2030-01-01'
         AND nc.AppliesToInvoiceNr = [inv].SerNr AND nci.InstallNr = [invInst].InstallNr 
         AND nc.InvoiceType = 1)
         
         (SELECT SUM(IF(inv.OriginType = 120,pir.InvoiceAmount,ABS(pir.InvoiceAmount)))
         FROM [:3] AS pir INNER JOIN [:4] AS p ON p.internalid = pir.masterid
         WHERE p.Status = 1 AND (p.Invalid = 0 or p.Invalid IS NULL)
         AND p.TransDate <= '2030-01-01'
         AND pir.InvoiceNr = [inv].SerNr)
         
         (SELECT SUM(IF(inv.OriginType = 120,payInvRow.InvoiceAmount,ABS(payInvRow.InvoiceAmount)))
         FROM [:3] AS payInvRow INNER JOIN [:4] AS pay ON pay.internalid = payInvRow.masterid
         WHERE pay.Status = 1 AND (pay.Invalid = 0 or pay.Invalid IS NULL)
         AND pay.TransDate <= '2030-01-01'
         AND payInvRow.InvoiceNr = inv.SerNr)
         
         (SELECT SUM(payInvRow.InvoiceAmount)
         FROM [:3] AS payInvRow INNER JOIN [:4] AS pay ON pay.internalid = payInvRow.masterid 
         WHERE pay.Status = 1 AND (pay.Invalid = 0 or pay.Invalid IS NULL)
         AND pay.TransDate <= '2030-01-01'
         AND payInvRow.InvoiceNr = inv.SerNr
         AND payInvRow.InstallNr = invInst.InstallNr)
         



















#four
SELECT 'B' as DocType,Cheque.Status as Type,4 InvoiceType,Cheque.SerNr, '' SupCode, '' SupName,Cheque.TransDate, Cheque.TransTime, Cheque.ExpDate DueDate, '' PayTerm, Cheque.CustCode, Cheque.CustName,
Cheque.ChequeNr OfficialSerNr, Cheque.Currency, Cheque.BankName, Cheque.OriginCurrencyRate CurrencyRate, Cheque.OriginBaseRate BaseRate, Cheque.Amount Total, 0 Saldo, Cheque.Office, if(Cheque.Reentered, 'Si', 'No') Comment,'' as CustGroup, '' AS DaCustGroup 
,Receipt.DelFantasyName, Receipt.DelAddressCode,'' as DelAddressName
,'' as SalesManName
FROM Cheque
INNER JOIN Customer ON Customer.Code = Cheque.CustCode
left JOIN ReceiptPayModeRow rpmr on  rpmr.ChequeNr = Cheque.SerNr 
left JOIN  Receipt ON  Receipt.internalId = rpmr.masterId and Receipt.Status = 1
left  JOIN  PayMode ON rpmr.PayMode = PayMode.Code AND(PayMode.PayType = 2 or PayMode.PayType = 104) 
WHERE Cheque.Status in (1,7) 
AND Cheque.Type  in (0,1,2) 
group by  Cheque.SerNr

#five - cheque
SELECT SerNr, Saldo, OnAccount.Currency,CurrencyRate, BaseRate,Entity as CustCode 
,Customer.Name as CustName
FROM OnAccount
INNER JOIN Customer on Customer.Code = Entity
WHERE OpenFlag = 1

#six - anticipos
SELECT OnAccount.SerNr,OnAccount.Entity, OnAccount.Saldo, OnAccount.Currency,OnAccount.CurrencyRate, OnAccount.BaseRate
FROM OnAccount
INNER JOIN Customer ON Customer.Code = OnAccount.Entity 
WHERE OpenFlag = 1
ORDER BY Entity 

#seven 
SELECT viir.InvoiceNr, count(ch.chequeNr) as qty FROM ValuesIncome vi 
INNER JOIN ValuesIncomeInvoiceRow viir ON vi.internalid = viir.masterid 
INNER JOIN ValuesIncomePayModeRow vipm on vi.internalid = vipm.masterid 
INNER JOIN Cheque ch ON vipm.ChequeNr = ch.SerNr and ch.Status = 1
WHERE?AND InvoiceNr = ? " invoiceNr"
WHERE?AND vi.Status = 1 
WHERE?AND (vi.Invalid = 0 OR vi.Invalid IS NULL) 
GROUP BY viir.InvoiceNr 


#retro - acc

SELECT IF(InvoiceType = 1, 'Credit Note' , 'Invoice') as Type, SerNr, BaseRate, inv.OfficialSerNr, TransDate, TransTime, DueDate,InvoiceDate, 
'' as InstallNr,inv.PayTerm,inv.CustCode as EntCode, ent.Name as EntName, ent.Phone as EntPhone,
inv.DelAddressCode,da.Comment as DelAddressName,
ent.PaymentManager, ent.PaymentPlace, ent.PaymentTime, ent.PaymentConsultDay, ent.PaymentDay,
inv.Currency, CurrencyRate, IF(InvoiceType=1,-(Total-IF(Aplicado,Aplicado,0)),Total) as Total, Saldo, Pagos.Pagado, NotasCredito.NCTotal, Aplicaciones.Aplicado
,(select NewCurRate from InvoiceCurrencyRateHistory where TransDate >= '1999-01-01' and InvoiceSerNr = inv.SerNr and OriginType = 1 limit 1) as CurRateHist
FROM Invoice AS inv
INNER JOIN Customer AS ent ON ent.Code = inv.CustCode 
INNER JOIN PayTerm ON (PayTerm.Code = inv.PayTerm AND PayTerm.PayType IN (0,1,4))
LEFT JOIN DeliveryAddress da ON da.Code = inv.DelAddressCode and da.CustCode = inv.CustCode 
LEFT JOIN (SELECT payInvRow.InvoiceNr, IF(ISNULL(SUM(ABS(payInvRow.InvoiceAmount))),0,SUM(ABS(payInvRow.InvoiceAmount))) AS Pagado
FROM ReceiptInvoiceRow AS payInvRow INNER JOIN Receipt AS pay ON pay.internalid = payInvRow.masterid
WHERE pay.Status = 1 AND (pay.Invalid = 0 or pay.Invalid IS NULL)
AND pay.TransDate <= '1999-01-01'
GROUP BY payInvRow.InvoiceNr
) AS Pagos ON (inv.SerNr = Pagos.InvoiceNr AND inv.InvoiceType <> 1)
LEFT JOIN (SELECT pir.InvoiceNr, IF(ISNULL(SUM(ABS(pir.InvoiceAmount))),0,SUM(ABS(pir.InvoiceAmount))) AS Aplicado
FROM ReceiptInvoiceRow AS pir INNER JOIN Receipt AS p ON p.internalid = pir.masterid
WHERE p.Status = 1 AND (p.Invalid = 0 or p.Invalid IS NULL)
AND p.TransDate <= '1999-01-01'
GROUP BY pir.InvoiceNr
) AS Aplicaciones ON (inv.SerNr = Aplicaciones.InvoiceNr AND inv.InvoiceType = 1)
LEFT JOIN (SELECT AppliesToInvoiceNr, IF(ISNULL(SUM(inv.Total)),0,SUM(inv.Total)) AS NCTotal
FROM Invoice AS inv
WHERE (inv.AppliesToInvoiceNr IS NOT NULL OR inv.AppliesToInvoiceNr <> 0)
AND inv.Status = 1 AND (inv.Invalid = 0 OR inv.Invalid IS NULL)
AND inv.DueDate <= '2030-01-01'
AND inv.InvoiceType = 1
GROUP BY AppliesToInvoiceNr ) AS NotasCredito ON inv.SerNr = NotasCredito.AppliesToInvoiceNr
WHERE (Invalid=0 OR Invalid IS NULL) 
AND DueDate <= '2030-01-01'
AND (inv.DisputedFlag = 0 OR inv.DisputedFlag IS NULL) 
AND Status = 1
AND (inv.AppliesToInvoiceNr = 0 OR inv.AppliesToInvoiceNr IS NULL)
AND (inv.Installments = 0 OR inv.Installments IS NULL) 
UNION ALL
SELECT 'Installment' as Type, SerNr, BaseRate, inv.OfficialSerNr as OfficialSerNr, TransDate, TransTime, invInst.DueDate as DueDate, InvoiceDate,
invInst.InstallNr, inv.PayTerm, inv.CustCode as EntCode, ent.Name as EntName, ent.Phone as EntPhone,'' as DelAddressCode,'' as DelAddressName,
ent.PaymentManager, ent.PaymentPlace, ent.PaymentTime, ent.PaymentConsultDay, ent.PaymentDay, 
inv.Currency, CurrencyRate, Amount as Total, invInst.Saldo, Pagos.Pagado,

(SELECT SUM(-nci.Amount)
FROM Invoice AS nc
INNER JOIN  InvoiceInstallRow nci ON `nc`.`internalId` = `nci`.`masterId`
WHERE (nc.AppliesToInvoiceNr IS NOT NULL OR nc.AppliesToInvoiceNr <> 0)
AND nc.Status = 1 AND (nc.Invalid = 0 OR nc.Invalid IS NULL)
AND nc.DueDate <= '2030-01-01'
AND nc.AppliesToInvoiceNr = inv.SerNr AND nci.InstallNr = invInst.InstallNr 
AND nc.InvoiceType = 1)

as NCTotal, 0 as Aplicado 
,(select NewCurRate from InvoiceCurrencyRateHistory where TransDate >= '2030-01-01' and InvoiceSerNr = inv.SerNr and OriginType = 1 limit 1) as CurRateHist
FROM InvoiceInstallRow AS invInst 
INNER JOIN InvoiceItemRow AS invInstRw ON invInst.internalId = invInstRw.masterId
INNER JOIN Invoice AS inv ON inv.internalId = invInst.masterId
INNER JOIN Customer AS ent ON ent.Code = inv.CustCode
INNER JOIN PayTerm ON (PayTerm.Code = inv.PayTerm AND PayTerm.PayType IN (0,1,4))
LEFT JOIN (SELECT payInvRow.InvoiceNr, payInvRow.InstallNr, IF(ISNULL(SUM(payInvRow.InvoiceAmount)),0,SUM(payInvRow.InvoiceAmount)) AS Pagado
FROM ReceiptInvoiceRow AS payInvRow INNER JOIN Receipt AS pay ON pay.internalid = payInvRow.masterid
WHERE pay.Status = 1 AND (pay.Invalid = 0 or pay.Invalid IS NULL)
AND pay.TransDate <= '1999-01-01'
GROUP BY payInvRow.InvoiceNr, payInvRow.InstallNr
) AS Pagos ON (inv.SerNr = Pagos.InvoiceNr AND invInst.InstallNr = Pagos.InstallNr)
WHERE (Invalid=0 OR Invalid IS NULL)
AND invInst.DueDate <= '2030-01-01'
AND (inv.DisputedFlag = 0 OR inv.DisputedFlag IS NULL) 
AND Status = 1
AND (inv.AppliesToInvoiceNr IS NULL OR inv.AppliesToInvoiceNr NOT IN (SELECT SerNr FROM Invoice inc WHERE inc.TransDate <= '1999-01-01' AND inc.CustCode = inv.CustCode))
ORDER BY SerNr