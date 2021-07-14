const moment = require('moment')
const Repositorie = require('../repositories/hbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Hbs {

    async init() {
        try {
            await this.listReceivables()
            await this.listSalary()
            await this.listUsers()
            await this.listClockMachine()
            
            console.log('list hbs ok');
        } catch (error) {
            console.log('list hbs error' + error);
            throw new InternalServerError(error)
        }
    }

    async listUsers() {
        try {
            await Repositorie.dropUsers()
            await Repositorie.createTableUsersHbs() 
            
            const data = await Repositorie.listUsers()

            if(data) {
                data.forEach(user => {

                    if (user.phone) {
                        user.phone = `${user.phone} - ${user.mobile}`
                    } else {
                        user.phone = user.mobile
                    }
    
                    if (user.sex === 1) {
                        user.sex = 'H'
                    } else {
                        user.sex = 'M'
                    }
    
                    switch (user.modalidad) {
                        case 1: "IPS"
                            break
                        case 2: "Sem Contrato"
                            break
                        case 3: "Contrato"
                            break
                    }
    
                    Repositorie.insertUser(user)
                });
            }

            return true
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listSalary() {
        try {
            const data = await Repositorie.listSalary()

            if(data){
                data.forEach(obj => {
                    const dt = `${obj.date} ${obj.time}`
                    const date = moment(dt).format("YYYY-MM-DD HH:mm:ss")
                    Repositorie.insertSalary(obj, date)
                });
            }

            return true
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }


    async listReceivables() {
        try {
            await Repositorie.dropReceivable()
            await Repositorie.createTableReceivable()

            const ncs = await Repositorie.listNcs()
            ncs.forEach(obj => {

                if(obj.Office === "06"){
                    const date1 = new Date(obj.date)
                    const date2 = new Date('01-01-2020')
                    if(date1.getTime() < date2.getTime()){
                        obj.Office = "06FDM"
                    }
                }
                Repositorie.insertReceivable(obj)
            });

            const inv = await Repositorie.listInvoices()
            inv.forEach(obj => {

                if(obj.Office === "06"){
                    const date1 = new Date(obj.date)
                    const date2 = new Date('01-01-2020')
                    if(date1.getTime() < date2.getTime()){
                        obj.Office = "06FDM"
                    }
                }

                Repositorie.insertReceivable(obj)
            });

            const installs = await Repositorie.listInstalls()
            installs.forEach(obj => {

                if(obj.Office === "06"){
                    const date1 = new Date(obj.date)
                    const date2 = new Date('01-01-2020')
                    if(date1.getTime() < date2.getTime()){
                        obj.Office = "06FDM"
                    }
                }

                Repositorie.insertReceivable(obj)
            });

            const cheques = await Repositorie.listCheque()
            cheques.forEach(obj => {

                if(obj.Office === "06"){
                    const date1 = new Date(obj.date)
                    const date2 = new Date('01-01-2020')
                    if(date1.getTime() < date2.getTime()){
                        obj.Office = "06FDM"
                    }
                }

                Repositorie.insertReceivable(obj)
            });

            console.log('finalizada a consulta')
            return true
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async listClockMachine() {
        try {
            const data = await Repositorie.listClockMachine()

            if(data){
                data.forEach(obj =>{
                    Repositorie.insertClockMachine(obj)
                })
            }

        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listItems(search) {
        try {
            return Repositorie.listItems(search)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listGoodyear(search) {
        try {
            return Repositorie.listGoodyear(search)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listPrice(search) {
        try {
            return Repositorie.listPrice(search)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

    async listStockByItem(artcode) {
        try {
            return Repositorie.listStockbyItem(artcode)
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }


    async listStockandGroup() {
        try {
            const stocks = await Repositorie.listStocks()
            const groups = await Repositorie.listItemGroup(stocks)
            const fields = {
                stocks,
                groups
            }

            return fields
        } catch (error) {
            throw new InternalServerError('Error')
        }
    }

}

module.exports = new Hbs