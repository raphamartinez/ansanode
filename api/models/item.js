const RepositorieHbs = require('../repositories/hbs')
const RepositoriePrice = require('../repositories/itemprice')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Item {

    async listExpectedSalesByManager(id_login) {
        try {
            const data = await RepositoriePrice.listExpectedSalesByManager(id_login)

            data.forEach(obj => {
                let tmp = obj.name.split(" ")
                obj.name = `${tmp[0]} ${tmp[1]}`

                obj.expected = obj.expected.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
            })

            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los goals.')
        }
    }


    async listExpectedSellers() {

        try {
            // let sellers = await RepositorieSeller.list(id_login)
            const prices = await RepositorieHbs.listItemPrice()

            prices.forEach(async obj => {
                const data = await RepositoriePrice.insert(obj)

            })

            return prices
        } catch (error) {
            throw new InternalServerError('No se pude listar los goals.')
        }

    }

}

module.exports = new Item