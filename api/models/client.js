const Repositorie = require('../repositories/client')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Client {

    list(){
        return Repositorie.list()
    }

    listHbs(){
        return Repositorie.listHbs()
    }
}

module.exports = new Client