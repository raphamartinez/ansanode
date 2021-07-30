const Repositorie = require('../repositories/stock')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Stock {

    async insert(stock, id_login) {
        try {
            stock.forEach(obj => {
                if(obj.length > 2){
                    console.log(obj);
                    Repositorie.insert(obj, id_login)
                }
            })

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo crear una nueva sucursal.')
        }
    }

    list(id_login) {
        try {
            return Repositorie.list(id_login)
            
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }

    delete(id_stock) {
        try {
            return Repositorie.delete(id_stock)
            
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las sucursales.')
        }
    }
}

module.exports = new Stock