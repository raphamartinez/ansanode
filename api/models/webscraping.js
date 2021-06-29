const puppeteer = require('puppeteer')
const Repositorie = require('../repositories/prosegur')
const xlsx = require('read-excel-file/node')
const excelToJson = require('convert-excel-to-json')
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const { getJsDateFromExcel } = require("excel-date-to-js");
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

async function readExcel(path) {

    const data = xlsx(path).then((rows) => {
        return rows
    })
    return data
}

async function timeToSecond(s) {
    var b = s.split(':');
    return b[0] * 3600 + b[1] * 60 + (+b[2] || 0);
}

async function secondToTime(secs) {
    function z(n) { return (n < 10 ? '0' : '') + n; }
    var sign = secs < 0 ? '-' : '';
    secs = Math.abs(secs);
    return sign + z(secs / 3600 | 0) + ':' + z((secs % 3600) / 60 | 0) + ':' + z(secs % 60);
}

async function formatStringDate(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];

    return ("0" + dia).slice(-2) + '-' + ("0" + mes).slice(-2) + '-' + ano;
}


async function formatStringDatetoCompare(data) {
    var ano = data.split("-")[2];
    var mes = data.split("-")[1];
    var dia = data.split("-")[0];

    return ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + '-' + ano;
}

async function dateCompare(d1, d2) {
    const dt1 = await formatStringDatetoCompare(d1)

    const date1 = new Date(dt1);
    const date2 = new Date(d2);

    if (date1.getTime() > date2.getTime()) {
        return true
    } else {
        return false
    }
}

class WebScraping {

    async init() {
        try {
            await this.listProsegurPowerandStop()
            await this.listProsegurMaintenance()
            await this.listProsegurOffice()
            await this.listInviolavel()
            await this.listProsegurDistance()
            await Repositorie.insertHistory('Actualizado con éxito')
            console.log('robot ok');
        } catch (error) {
            await Repositorie.insertHistory(`Error - ${error}`)
            console.log('robot error');
            throw new InternalServerError(error)
        }
    }

    async listWebscrapingHistory() {
        try {
            const dateReg = await Repositorie.listHistoryWebscraping()
            return dateReg
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async listProsegurPowerandStop() {
        try {

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox'],
            })
            const page = await browser.newPage()
            await page.goto('https://localizacion.prosegur.com/login?origin=subdomain&timezone=3')
            await page.type('#nombre', process.env.PROSEGUR_MAIL)
            await page.type('#pass', process.env.PROSEGUR_PASSWORD)
            await page.click('#btn-submit')

            await page.waitForNavigation()
            await page.waitForTimeout(2000)

            await page.goto('https://localizacion.prosegur.com/informes/detenciones')
            await page.waitForTimeout(4000)

            await page.click(`select [value="ALL"]`)
            await page.waitForTimeout(1000)

            const form = await page.$('#form');

            await form.evaluate(form => form.submit());
            await page.waitForNavigation()
            await page.waitForTimeout(4000)
            await page.click(`#datatableStops_wrapper > div.top > div.dt-buttons > button:nth-child(1)`)
            await page.click(`#datatableStopsOnOff_wrapper > div.top > div.dt-buttons > button:nth-child(1)`)
            const tableStop = await page.evaluate(() => {
                const tdsNeumaticos = Array.from(document.querySelectorAll('#datatableStops tr'),
                    row => Array.from(row.querySelectorAll('tr, td'), cell => cell.innerText))
                return tdsNeumaticos
            })

            const tableOnOff = await page.evaluate(() => {
                const tdsNeumaticos = Array.from(document.querySelectorAll('#datatableStopsOnOff tr'),
                    row => Array.from(row.querySelectorAll('tr, td'), cell => cell.innerText))
                return tdsNeumaticos
            })

            await browser.close()

            const stop = tableStop.slice(1)
            const onOff = tableOnOff.slice(1)

            if (stop.length !== 1) {
                stop.forEach(async line => {
                    const pop = line.pop()
                    const office = line[3].slice(1, 7)

                    var dia = line[1].slice(8, 10)
                    var mes = line[1].split("-")[1];
                    var ano = line[1].split("-")[0];
                    var hora = line[1].split(" ")[1];

                    const date = ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + '-' + ano + " " + hora;
                    const lastInsertArrest = await Repositorie.listArrest(line[2])

                    const date1 = new Date(date);
                    const date2 = new Date(lastInsertArrest);

                    if (date1.getTime() > date2.getTime()) {
                        console.log(line[0], line[1], line[2], line[3], line[4], line[5], line[6], line[7], office);
                        await Repositorie.insertArrest(line[0], line[1], line[2], line[3], line[4], line[5], line[6], line[7], office)
                    }
                })
            }

            if (onOff.length !== 1) {
                onOff.forEach(async line => {
                    const pop = line.pop()

                    var dia = line[1].slice(8, 10)
                    var mes = line[1].split("-")[1];
                    var ano = line[1].split("-")[0];
                    var hora = line[1].split(" ")[1];

                    const date = ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + '-' + ano + " " + hora;
                    const lastInsertPower = await Repositorie.listPower(line[2])

                    const date1 = new Date(date);
                    const date2 = new Date(lastInsertPower);

                    if (date1.getTime() > date2.getTime()) {
                        console.log(line);
                        await Repositorie.insertPower(line)
                    }
                })
            }

        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async listProsegurMaintenance() {
        try {

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox'],
            })

            const page = await browser.newPage()
            await page.goto('https://localizacion.prosegur.com/login?origin=subdomain&timezone=3')

            let reqPath = path.join(__dirname, '../../')
            await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: reqPath });
            await page.type('#nombre', process.env.PROSEGUR_MAIL)
            await page.type('#pass', process.env.PROSEGUR_PASSWORD)
            await page.click('#btn-submit')

            await page.waitForNavigation()
            await page.waitForTimeout(3000)

            await page.goto('https://localizacion.prosegur.com/informes/mantenimientos')
            await page.waitForTimeout(4000)

            const dtInit = await page.$eval("#dateInit", (input) => {
                return input.getAttribute("value")
            });

            const dtEnd = await page.$eval("#dateEnd", (input) => {
                return input.getAttribute("value")
            });

            await page.click(`select [value="TODOS"]`)
            await page.waitForTimeout(3000)

            await page.click('#button_generar_excel')
            await page.waitForTimeout(5000)
            await browser.close()

            const filePath = `${reqPath}Mantenimientos_${dtInit}_${dtEnd}.xlsx`
            const fields = await readExcel(filePath)
            fields.splice(0, 4)

            fields.forEach(async line => {
                const timestamp = getJsDateFromExcel(line[4]);
                const dt = moment(timestamp).format("DD-MM-YYYY HH:mm:ss")

                var ano = dt.split("-")[2];
                var mes = dt.split("-")[1];
                var dia = dt.split("-")[0];

                const dateMaintenance = ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + '-' + ano;

                const lastInsert = await Repositorie.listMaintenance(line[0])

                const date1 = new Date(dateMaintenance);
                const date2 = new Date(lastInsert);

                if (date1.getTime() > date2.getTime()) {
                    const date = moment(timestamp).format("YYYY-MM-DD HH:mm:ss")
                    Repositorie.insertMaintenance(line[0], line[1], line[2], line[3], date, line[5], line[6], line[7], line[8], line[9], line[10])
                }
            })

            fs.unlinkSync(filePath)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async listProsegurDistance() {
        try {

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox'],
            })

            const page = await browser.newPage()
            await page.goto('https://localizacion.prosegur.com/login?origin=subdomain&timezone=3')

            let reqPath = path.join(__dirname, '../../')
            await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: reqPath });
            await page.type('#nombre', process.env.PROSEGUR_MAIL)
            await page.type('#pass', process.env.PROSEGUR_PASSWORD)
            await page.click('#btn-submit')

            await page.waitForNavigation()
            await page.waitForTimeout(3000)

            await page.goto('https://localizacion.prosegur.com/informes/distancias-recorridas')
            await page.waitForTimeout(3000)

            const dtInit = await page.$eval("#dateInit", (input) => {
                return input.getAttribute("value")
            });            const dtEnd = await page.$eval("#dateEnd", (input) => {
                return input.getAttribute("value")
            });

            await page.click(`select [value="TODOS"]`)
            await page.waitForTimeout(2000)

            await page.click('#button_generar')
            await page.waitForTimeout(10000)

            await page.click(`#DataTables_Table_0_wrapper > div.top > div.dt-buttons > button`)
            await page.waitForTimeout(9000)
            await browser.close()

            const filePath = `prosegur.xlsx`

            const result = excelToJson({
                sourceFile: filePath
            });

            var arr = Object.entries(result.prosegur)
            arr.forEach(obj => {
                const field = Object.values(obj[1])
                const car = field.shift()
                const plate = car.substring(0, car.indexOf(" "))
                const km = field.pop()
                if (typeof km === 'number') {
                    Repositorie.insertDistance(plate, km)
                }
            })

            fs.unlinkSync(filePath)
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async listProsegurOffice() {
        try {
            const browser = await puppeteer.launch({
                args: ['--lang=pt-BR', '--no-sandbox'],
                headless: true,
            })
            const page = await browser.newPage()

            await page.setExtraHTTPHeaders({
                'Accept-Language': 'pt'
            });

            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, "language", {
                    get: function () {
                        return "pt-BR";
                    }
                });
                Object.defineProperty(navigator, "languages", {
                    get: function () {
                        return ["pt-BR", "pt"];
                    }
                });
            });

            await page.goto('https://smart.prosegur.com/smart-web-min/smart-login/#/negocios')
            await page.waitForTimeout(4000)

            await page.type('#txt_user_name', process.env.PROSEGUR_MAIL)
            await page.type('#txt_user_pass', process.env.PROSEGUR_PASSWORD)
            await page.click('#btn_enter')

            await page.waitForNavigation()

            await page.goto('https://smart.prosegur.com/smart-web-min/smart-multisede/#/event-console')
            await page.waitForTimeout(4000)

            const data = await page.evaluate(() => {
                const tdsNeumaticos = Array.from(document.querySelectorAll('body > div.container > div > div.main-content.ng-scope > div.table-responsive.ng-scope > div'),
                    row => Array.from(row.querySelectorAll('div >.table-row, div'),
                        cell => cell.innerText))
                return tdsNeumaticos
            })
            await browser.close()

            data.forEach(async obj => {

                const chunk = (array) =>
                    array.reduce((acc, _, i) => {
                        if (i % 8 === 0) acc.push(array.slice(i, i + 8))
                        return acc
                    }, [])

                const chunked = chunk(obj, 8)

                const tires = chunked.slice(1)

                if (tires.length !== 1) {
                    tires.forEach(async line => {

                        const lastInsert = await Repositorie.listOffice(line[5])

                        var date1 = await timeToSecond(line[3])
                        var date2 = await timeToSecond("01:00:00") // colocar -2

                        var diff = date1 - date2

                        const timeFinal = await secondToTime(diff)
                        const newDate = await formatStringDate(line[2])

                        var ano = newDate.split("-")[2];
                        var mes = newDate.split("-")[1];
                        var dia = newDate.split("-")[0];

                        const date = ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2);
                        const time = `${date} ${timeFinal}`

                        const newdate1 = moment(time)

                        const newdate2 = moment(lastInsert)

                        if (newdate1.isAfter(newdate2)) {
                            const date = moment(time).format("YYYY-MM-DD HH:mm")
                            Repositorie.insertOffice(date, line[4], line[5], line[6])
                        }
                    })
                }
            })
        } catch (error) {
            throw new InternalServerError(error)
        }
    }

    async listInviolavel() {
        try {

            const provider = "0686"

            const logins = [
                [
                    "DCMEX",
                    "3500",
                    "345",
                    "ANSA3500"
                ],
                [
                    "ANSA IMPORTADOS DEPOSITO",
                    "3502",
                    "371",
                    "ANSA3502"
                ],
                [
                    "DC7",
                    "3532",
                    "233",
                    "ANSA3532"
                ],
                [
                    "DCMEX3",
                    "3533",
                    "583",
                    "ANSA3533"
                ],
                [
                    "AC PJC",
                    "3537",
                    "494",
                    "ANSA3537"
                ],
                [
                    "TRUCK",
                    "3538",
                    "493",
                    "ANSA3538"
                ],
                [
                    "ANSA DEPOSITO CENTRO DE CAMARAS",
                    "3539",
                    "288",
                    "ANSA3539"
                ],
                [
                    "DC",
                    "3540",
                    "511",
                    "ANSA3540"
                ],
                [
                    "ANSA ADM",
                    "3541",
                    "936",
                    "ANSA3541"
                ],
                [
                    "ANSA IMPORTADOS",
                    "3543",
                    "911",
                    "ANSA3543"
                ],
                [
                    "",
                    "3587",
                    "232",
                    "ANSA3587"
                ]
            ]

            logins.forEach(async login => {

                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox']
                })

                const page = await browser.newPage()
                await page.goto('https://webalarme.com.br/', {waitUntil: 'load'})
                await page.type('body > div.login.ng-scope > div.content > form > div.row.form-group.inline-fields.ng-scope > div.field.margin-right-10-percent > input', provider)
                await page.type('body > div.login.ng-scope > div.content > form > div.row.form-group.inline-fields.ng-scope > div:nth-child(2) > input', login[2])
                await page.type('body > div.login.ng-scope > div.content > form > div:nth-child(4) > div.form-group > div > input', login[3])
                await page.click('body > div.login.ng-scope > div.content > form > div.form-actions.padding-login > button')

                await page.waitForNavigation()

                await page.goto('https://webalarme.com.br/#!/events', {waitUntil: 'load'})
                page.setDefaultNavigationTimeout(0); 
                await page.waitForTimeout(4000)

                const data = await page.evaluate(() => {
                    const tdsNeumaticos = Array.from(document.querySelectorAll('body > div.page-wrapper.ng-scope > div.page-container > div.page-content-wrapper > div > div.col-12.ng-scope > div > div.portlet-body > div '),
                        row => Array.from(row.querySelectorAll('div > div > div.mt-comment, -body > div.mt-comment-text.ng-binding.ng-scope, td'),
                            cell => cell.innerText))
                    return tdsNeumaticos
                })
                await browser.close()

                await data.forEach(async object => {

                    const result = object.toString()
                    const removeSpace = result.split('\n').toString()
                    const objectarray = removeSpace.split(',')

                    var i = 0;
                    while (i < objectarray.length) {
                        if (objectarray[i].trim() === 'TESTE AUTOMATICO DO RADIO') {
                            objectarray.splice(i, 2);
                        } else {
                            ++i;
                        }
                    }

                    const chunk = (array) =>
                        array.reduce((acc, _, i) => {
                            if (i % 3 === 0) acc.push(array.slice(i, i + 3))
                            return acc
                        }, [])

                    const chunked = await chunk(objectarray, 3)
                    await chunked.forEach(async line => {
                        const office = login[0]
                        const title = line[0].trim()
                        const dt = line[1].split(" ")[0]
                        const time = line[1].split(" ")[1]
                        const lastInsert = await Repositorie.listInviolavel(office)

                        var dia = dt.split("/")[0];
                        var mes = dt.split("/")[1];
                        var ano = dt.split("/")[2];
                    
                        const date = ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + " " + time;

                        const newdate1 = moment(date);

                        const newdate2 = moment(lastInsert)

                        if (newdate1.isAfter(newdate2)) {
                            const date = moment(newdate1).format("YYYY-MM-DD HH:mm:ss")
                            console.log(date);
                            await Repositorie.insertInviolavel(title, date, line[2], login[0])
                        }
                    })
                })
            })

        } catch (error) {
            throw new InternalServerError(error)
        }
    }
}

module.exports = new WebScraping