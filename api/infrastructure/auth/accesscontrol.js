const AccessControl = require('accesscontrol')
const controll = new AccessControl()

// 0 - user
// 1 - admin 
// 2 - vendedor
// 3 - depositero
// 4 - gerente
// 5 - personal administrativo
// 6 - encarregado de Sucursal
// 7 - Auditor
// 8 - Patrimonio

controll
    .grant('7')
    .readAny('patrimony')
    .createAny('patrimony')
    .updateAny('patrimony')
    .deleteAny('patrimony')
    .readOwn('history')
    .readOwn('user')
    .readOwn('office')

controll
    .grant('6')
    .readOwn('finance')
    .createAny('finance')
    .updateAny('finance')
    .deleteAny('finance')
    .readOwn('clients')
    .createAny('clients')
    .updateAny('clients')
    .deleteAny('clients')
    .readOwn('history')
    .readOwn('user')
    .readOwn('office')

controll
    .grant('5')
    .readOwn('clock')
    .readAny('finance')
    .createAny('finance')
    .updateAny('finance')
    .readAny('clients')
    .readOwn('history')
    .readOwn('powerbi')
    .readOwn('user')
    .readAny('sales')
    .readOwn('office')
    .readAny('salesman')
    
controll
    .grant('6')
    .readOwn('finance')
    .createAny('finance')
    .updateAny('finance')
    .readAny('clients')
    .readOwn('history')
    .readOwn('powerbi')
    .readOwn('user')
    .readOwn('sales') 
    .readOwn('office')
    .readAny('salesman')

controll
    .grant('2')
    .readOwn('clock')
    .readAny('items')
    .readAny('pricelist')
    .readOwn('goal')
    .createOwn('goal')
    .deleteOwn('goal')
    .updateOwn('goal')
    .readOwn('goal')
    .readOwn('history')
    .readAny('items')
    .readAny('pricelist')
    .readAny('goodyear')
    .readOwn('office')
    .readOwn('powerbi')
    .readOwn('user')
    .readOwn('crm', ['id'])
    .createOwn('crm')
    .deleteOwn('crm')
    .updateOwn('crm')

controll
    .grant('4')
    .readOwn('clock')
    .readOwn('goal')
    .createOwn('goal')
    .deleteOwn('goal')
    .updateOwn('goal')
    .readOwn('goal')
    .readOwn('history')
    .readAny('items')
    .readOwn('pricelist')
    .readOwn('goodyear')
    .readOwn('office')
    .readOwn('powerbi')
    .readAny('salesman')
    .readOwn('stock')
    .readOwn('user')
    .readOwn('clients')
    .readOwn('sales')
    .readOwn('finance')
    .readOwn('office')
    .readOwn('crm', ['office'])


controll
    .grant('3')
    .readAny('stock')
    .readOwn('history')
    .readOwn('user')

controll
    .grant('1')
    .extend('5') 
    .readAny('clock')
    .readAny('patrimony')
    .createAny('patrimony')
    .deleteAny('patrimony')
    .updateAny('patrimony')
    .readAny('file')
    .createAny('file')
    .deleteAny('file')
    .updateAny('file')
    .createAny('goal')
    .deleteOwn('goal')
    .updateAny('goal')
    .readAny('goal')
    .readAny('price')
    .readAny('history')
    .readAny('items')
    .readAny('goodyear')
    .readAny('mail')
    .createAny('mail')
    .deleteAny('mail')
    .updateAny('mail')
    .readAny('office')
    .createAny('powerbi')
    .deleteAny('powerbi')
    .updateAny('powerbi')
    .readAny('powerbi')
    .readAny('salesman')
    .createAny('salesman')
    .deleteAny('salesman')
    .updateAny('salesman')
    .readAny('stock')
    .deleteAny('user')
    .updateAny('user')
    .createAny('user')
    .readAny('user')
    .readAny('clients')
    .readAny('sales')
    .readAny('quiz')
    .createAny('quiz')
    .deleteAny('quiz')
    .updateAny('quiz')
    .readAny('crm')
    .createAny('crm')
    .deleteAny('crm')
    .updateAny('crm')

module.exports = controll