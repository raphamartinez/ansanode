const Repositorie = require('../repositories/label')
const RepositorieGoal = require('../repositories/goalline')
const RepositorieHbs = require('../repositories/hbs')
const { InvalidArgumentError, InternalServerError } = require('./error')
const xl = require('excel4node');

async function datesGoal() {

    const dates = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13
    ]

    let datecolumn = []

    dates.forEach(date => {
        const today = new Date()

        let month = today.getMonth() + date
        let year = today.getFullYear()

        if (month > 12) {
            month -= 12
            year += 1
        }

        if (month <= 9) {
            month = `0${month}`
        }

        const now = `${month}/${year}`
        datecolumn.push(now)
    })

    return datecolumn
}

async function colorCell(wb, color, pattern) {

    return wb.createStyle({
        fill: {
            type: 'pattern',
            fgColor: color,
            patternType: pattern || 'solid',
        }
    });
}

class GoalLine {

    async create(date) {
        try {

            const items = await Repositorie.listItemLabel()
            const labels = await Repositorie.list()

            items.forEach(item => {
                let label = labels.find(label => label.code === item.labelcode)

                if (label) {

                    let goal = {
                        itemcode: item.itemcode,
                        itemname: item.itemname,
                        itemgroup: item.itemgroup,
                        labelname: item.labelname,
                        labelcode: label.code,
                        application: label.application,
                        provider: label.provider,
                        date: date
                    }

                    if (goal.application !== "DESCONSIDERAR") {
                        RepositorieGoal.insert(goal)
                    }

                }
            })


            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo crear un nuevo vendedor.')
        }
    }

    async list(id_salesman, office, group, checkstock) {
        try {
            const data = await RepositorieGoal.list(id_salesman, group)

            const stocks = [
                ["01AUTOPJC", "1"],
                ["01CAFE", "11"],
                ["01DOSRUED", "11"],
                ["01IMPPJC", "1"],
                ["02AUTOCDE", "2"],
                ["03AUTOBVIS", "3"],
                ["04AUTOENC", "4"],
                ["05AUTOSAL", "5"],
                ["06AUTOFDO", "11"],
                ["06AUTOSHCH", "6"],
                ["07AUTOBADO", "7"],
                ["10TRUCK", "10"],
                ["12AUTORITA", "12"],
                ["13AUTOMRA", "13"],
                ["DCCDE", "2"],
                ["DEPTRANIMP", "11"],
                ["MATRIZ", "11"],
            ]

            let arrstock = " "

            stocks.forEach(stock => {
                if (stock[1] === office) {
                    const st = stock[0]

                    if (arrstock.length > 1) {
                        arrstock += ` ,'${st}' `
                    } else {
                        arrstock += `'${st}' `
                    }
                }
            })


            let arr = []
            for (let obj of data) {

                const stock = await RepositorieHbs.listItemsStock(obj.itemcode, arrstock)

                if (stock.Reserved > 0) stock.Qty -= stock.Reserved
                if (stock.CityReserved > 0) stock.CityQty -= stock.CityReserved
                if (stock.CityQty === null) stock.CityQty = 0

                obj.CityQty = stock.CityQty
                obj.Qty = stock.Qty

                if (checkstock === 1) {
                    arr.push(obj)
                } else {
                    if (obj.Qty > 0) arr.push(obj)
                }
            }

            return arr
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los vendedores.')
        }
    }

    async listExcel(id_salesman, groups) {
        try {
            const data = await RepositorieGoal.listExcel(id_salesman, groups)
            const wb = new xl.Workbook({
                author: 'America Neumáticos S.A',
            });

            const headerStyle = wb.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '#4e73df',
                },
                font: {
                    color: '#FFFFFF',
                    size: 14,
                }
            });

            const ws = wb.addWorksheet('Meta');

            const dates = await datesGoal()

            const titles = [
                "Vendedor",
                "Id",
                "Grupo",
                "Producto",
                "Aplicacion",
                "Nº Etiqueta",
                "Etiqueta",
                "Cod Articulo",
                "Articulo",
                dates[0],
                dates[1],
                dates[2],
                dates[3],
                dates[4],
                dates[5],
                dates[6],
                dates[7],
                dates[8],
                dates[9],
                dates[10],
                dates[11],
                dates[12]
            ]

            const date = new Date()
            const date2 = new Date(date.getTime() - 14400000)
            const now = `${date2.getHours()}:${date2.getMinutes()} ${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}`

            ws.addImage({
                path: './public/img/ansalogomin.png',
                type: 'picture',
                position: {
                  type: 'absoluteAnchor',
                  from: {
                    col: 1,
                    row: 1,
                    rowOff: 0,
                  },
                },
              });

            ws.cell(1, 2, 2, 9, true).string(`Establecimiento de Metas - ${data[0].code}`).style(wb.createStyle({
                font: {
                    bold: true,
                    color: '#000000',
                    size: 21,
                }
            }))

            ws.cell(3,2,3,9, true).string(`Fecha de Registro: ${now}`)
            ws.cell(4,2,4,9, true).string(`Grupos: ${groups}`)
            ws.cell(5,2,5,9, true)
            ws.column(2).hide()
            ws.row(6).freeze();
            ws.column(5).setWidth(35);
            ws.column(7).setWidth(35);
            ws.column(9).setWidth(50).freeze()
            ws.row(6).filter({
                firstColumn: 1,
                lastColumn: 9
            });


            let headerIndex = 1
            titles.forEach(title => {
                ws.cell(6, headerIndex++).string(title).style(headerStyle)
            })

            let rowIndex = 7
            data.forEach(record => {
                let columnIndex = 1
                Object.keys(record).forEach(columnName => {
                    switch (columnIndex) {
                        case 2:
                            ws.cell(rowIndex, columnIndex++).number(record[columnName])
                            break
                        default:
                            if (columnIndex > 9) {
                             if(typeof record[columnName] === "object") record[columnName] = 0
                                ws.cell(rowIndex, columnIndex++).number(parseInt(record[columnName]))
                            } else {
                                ws.cell(rowIndex, columnIndex++).string(record[columnName])
                            }
                            break
                    }
                })
                rowIndex++
            })

            // wb.write('meta.xlsx');
            // wb.write('meta.xlsx', res); escrever na resposta

            return wb
        } catch (error) {
            console.log(error);
            throw new InternalServerError(error)
        }
    }

    update() {
        try {
            return Repositorie.update(goal)
        } catch (error) {
            throw new InternalServerError('No se pude actualizar lo vendedor.')
        }
    }

    delete(id_goal) {
        try {
            return Repositorie.delete(id_goal)

        } catch (error) {
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new GoalLine