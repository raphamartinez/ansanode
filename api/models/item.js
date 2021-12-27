const Repositorie = require('../repositories/item')
const RepositorieHbs = require('../repositories/hbs')
const RepositoriePrice = require('../repositories/itemprice')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Item {

    // async listExpectedSalesByManager(id_login) {
    //     try {
    //         const data = await RepositoriePrice.listExpectedSalesByManager(id_login)

    //         data.forEach(obj => {
    //             let tmp = obj.name.split(" ")
    //             obj.name = `${tmp[0]} ${tmp[1]}`

    //             obj.expected = obj.expected.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
    //         })

    //         return data
    //     } catch (error) {
    //         throw new InternalServerError('No se pudieron enumerar los goals.')
    //     }
    // }


    async listExpectedSellers() {

        try {
            const prices = await RepositorieHbs.listItemPrice()

            let ids = [];
            for(let price of prices){
                const id = await RepositoriePrice.insert(price);

                ids.push(id);
            }
    
            return ids;
        } catch (error) {
            throw new InternalServerError('No se pude listar los goals.')
        }
    }

    listInvoiceItems(invoice){
        try {
            return RepositorieHbs.listInvoiceItems(invoice)
        } catch (error) {
            throw new InternalServerError('No se pude listar los items.')
        }
    }

    listUnion(){
        try {
            return Repositorie.listUnion()
        } catch (error) {
            throw new InternalServerError('No se pude listar los items.')
        }
    }
}

module.exports = new Item