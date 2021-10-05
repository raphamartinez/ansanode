const AccessControl = require('accesscontrol')
const controll = new AccessControl()

// 0 - user
// 1 - admin 
// 2 - vendedor
// 3 - depositero
// 4 - gerente
// 5 - personal administrativo

controll
    .grant('5')
    .readAny('finance')
    .createAny('finance')
    .updateAny('finance')
    .readAny('clients')
    .readOwn('history')
    .readOwn('powerbi')
    .readOwn('user')
    .readAny('sales')

controll
    .grant('2')
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

controll
    .grant('4')
    .readAny('goal')
    .createAny('goal')
    .deleteAny('goal')
    .updateAny('goal')
    .readAny('goal')
    .readOwn('history')
    .readAny('items')
    .readAny('pricelist')
    .readAny('goodyear')
    .readAny('office')
    .readOwn('powerbi')
    .readAny('salesman')
    .readAny('stock')
    .readOwn('user')
    .readOwn('clients')
    .readAny('sales')

controll
    .grant('3')
    .readAny('stock')
    .readOwn('history')
    .readOwn('user')

controll
    .grant('1')
    .extend('5')
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
    .readAny('stock')
    .deleteAny('user')
    .updateAny('user')
    .createAny('user')
    .readAny('user')
    .readAny('clients')
    .readAny('sales')

module.exports = controll