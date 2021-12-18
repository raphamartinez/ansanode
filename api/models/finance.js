const Repositorie = require('../repositories/finance')
const RepositorieHbs = require('../repositories/hbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

class Finance {

    async insert(finance, id_login) {
        try {

            const check = await Repositorie.check(finance)

            if (check) {
                finance.id_financeinvoice = check.id_financeinvoice
                return Repositorie.update(finance, id_login)
            } else {
                return Repositorie.insert(finance, id_login)
            }

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los goals.')
        }
    }

    async update(finance) {
        try {
            return Repositorie.update(finance)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los goals.')
        }
    }

    async delete(finance) {
        try {
            return Repositorie.delete(finance)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los goals.')
        }
    }

    async list(clients, offices, overdue, type) {
        try {
            const data = await Repositorie.list(clients, offices, overdue, type)
            let invoices = []

            await data.forEach(obj => {
                if (obj.AmountOpen < 0) obj.AmountOpen = 0
                if (obj.AmountBalance < 0) obj.AmountBalance = 0

                if (overdue === "1") {
                    if (obj.AmountBalance > 0) invoices.push(obj)
                } else {
                    invoices.push(obj)
                }
            })

            return invoices

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los goals.')
        }
    }


    async listClients(client, date) {

        try {

            let lastday = new Date()
            let day = new Date()
            let d1
            let d2
            let dview
            switch (date) {
                case "*":
                    dview = await Repositorie.listClient(client, 0, 0)

                    dview.forEach(obj => {
                        if (obj.comment === null) obj.comment = " "
                        if (obj.responsible === null) obj.responsible = " "
                        if (obj.contact === null) obj.contact = " "

                        switch (obj.status) {
                            case 0:
                                obj.statusdesc = "Pendiente"
                                break
                            case 1:
                                obj.statusdesc = "Pago cuestionado"
                                break
                            case 2:
                                obj.statusdesc = "Pago pronto"
                                break
                            case 3:
                                obj.statusdesc = "Pago rechazado"
                                break
                            case 4:
                                obj.statusdesc = "Reenviar al gerente"
                                break
                            default:
                                obj.statusdesc = "Pendiente"
                                break
                        }
                    })

                    return dview
                    break;
                case "15":
                    lastday.setDate(lastday.getDate() - 15)
                    day.setDate(day.getDate())

                    break;
                case "30":
                    lastday.setDate(lastday.getDate() - 30);
                    day.setDate(day.getDate() - 16);

                    break;
                case "60":
                    lastday.setDate(lastday.getDate() - 60);
                    day.setDate(day.getDate() - 31);

                    break;
                case "90":
                    lastday.setDate(lastday.getDate() - 90);
                    day.setDate(day.getDate() - 61);

                    break;
                case "120":
                    lastday.setDate(lastday.getDate() - 120);
                    day.setDate(day.getDate() - 91);

                    break;
                case "120+":
                    lastday.setDate(lastday.getDate() - 10000);
                    day.setDate(day.getDate() - 121);

                    break;
                default:
                    dview = await Repositorie.listClient(client, 0, 0)

                    dview.forEach(obj => {
                        if (obj.comment === null) obj.comment = " "
                        if (obj.responsible === null) obj.responsible = " "
                        if (obj.contact === null) obj.contact = " "

                        switch (obj.status) {
                            case 0:
                                obj.statusdesc = "Pendiente"
                                break
                            case 1:
                                obj.statusdesc = "Pago cuestionado"
                                break
                            case 2:
                                obj.statusdesc = "Pago pronto"
                                break
                            case 3:
                                obj.statusdesc = "Pago rechazado"
                                break
                            case 4:
                                obj.statusdesc = "Reenviar al gerente"
                                break
                            default:
                                obj.statusdesc = "Pendiente"
                                break
                        }
                    })

                    return dview

                    break;
            }

            d1 = `${lastday.getFullYear()}-${lastday.getMonth() + 1}-${lastday.getDate()}`
            d2 = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`

            const data = await Repositorie.listClient(client, d1, d2)
            data.forEach(obj => {
                if (obj.comment === null) obj.comment = " "
                if (obj.responsible === null) obj.responsible = " "
                if (obj.contact === null) obj.contact = " "

                switch (obj.status) {
                    case 0:
                        obj.statusdesc = "Pendiente"
                        break
                    case 1:
                        obj.statusdesc = "Pago cuestionado"
                        break
                    case 2:
                        obj.statusdesc = "Pago pronto"
                        break
                    case 3:
                        obj.statusdesc = "Pago rechazado"
                        break
                    case 4:
                        obj.statusdesc = "Reenviar al gerente"
                        break
                    default:
                        obj.statusdesc = "Pendiente"
                        break
                }
            })

            return data
        } catch (error) {
            throw new InternalServerError('No se pude listar los goals.')
        }

    }

    listSalesOrders(search) {
        try {
            return RepositorieHbs.listSalesOrder(search)
        } catch (error) {
            throw new InternalServerError('No se pude listar las orders.')
        }
    }

    async listInvoiceHistory(invoice) {

        try {
            const data = await Repositorie.listInvoiceHistory(invoice)

            data.forEach(obj => {

                if (obj.comment === null) obj.comment = " "
                if (obj.responsible === null) obj.responsible = " "
                if (obj.contact === null) obj.contact = " "
                if (obj.payday === null) obj.payday = " "
                if (obj.contactdate === null) obj.contactdate = " "

                switch (obj.status) {
                    case 0:
                        obj.statusdesc = "Pendiente"
                        break
                    case 1:
                        obj.statusdesc = "En Gestion de Cobro"
                        break
                    case 2:
                        obj.statusdesc = "Pago Programado"
                        break
                    case 3:
                        obj.statusdesc = "Reenviar al gerente"
                        break
                    default:
                        obj.statusdesc = "Pendiente"
                        break
                }
            })

            return data
        } catch (error) {
            throw new InternalServerError('No se pude listar los datos.')
        }
    }

    async graphReceivable(id_login, offices, datestart, dateend) {
        try {

            const data = await Repositorie.graphReceivable(id_login, offices, datestart, dateend);

            return data;
        } catch (error) {
            throw new InternalServerError('No se pude listar los datos.')
        }
    }
}

module.exports = new Finance