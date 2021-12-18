const puppeteer = require('puppeteer')
const Repositorie = require('../repositories/prosegur')
const RepositorieUser = require('../repositories/proseguruser')
const xlsx = require('read-excel-file/node')
const excelToJson = require('convert-excel-to-json')
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const scissors = require('scissors')
const { getJsDateFromExcel } = require("excel-date-to-js");
const { InternalServerError } = require('../models/error')

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

class WebScraping {

    async init() {
        try {
            await this.listProsegurPowerandStop()
            await this.listProsegurMaintenance()
            // await this.listProsegurOffice()
            await this.listInviolavel()
            await this.listProsegurDistance()
            await Repositorie.insertHistory('Actualizado con éxito')
            console.log('robot ok');
        } catch (error) {
            await Repositorie.insertHistory(`Error - ${error}`)
            console.log(`erro no robô - ${error}`);
            throw new InternalServerError('No se pudo ejecutar el robot.')
        }
    }

    async listWebscrapingHistory() {
        try {
            const dateReg = await Repositorie.listHistoryWebscraping()
            return dateReg
        } catch (error) {
            throw new InternalServerError('No se pudo listar el Webscraping.')
        }
    }

    async listProsegurPowerandStop() {
        try {

            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox'],
            })
            const page = await browser.newPage()
            await page.goto('https://localizacion.prosegur.com/login?origin=subdomain&timezone=3', { waitUntil: 'networkidle0' })
            await page.type('#nombre', process.env.PROSEGUR_MAIL)
            await page.type('#pass', process.env.PROSEGUR_PASSWORD)
            await page.click('#btn-submit')
            await page.waitForNavigation()

            await page.goto('https://localizacion.prosegur.com/informes/detenciones', { waitUntil: 'networkidle0' })
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

                    var time1 = await timeToSecond(hora)
                    var time2 = await timeToSecond("04:00:00") // gmt -4

                    var diff = time1 - time2

                    const timeFinal = await secondToTime(diff)

                    const date = ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + '-' + ano + " " + timeFinal;
                    const lastInsertArrest = await Repositorie.listArrest(line[2])

                    const date1 = new Date(date);
                    const date2 = new Date(lastInsertArrest);

                    if (date1.getTime() > date2.getTime()) {
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

                    var time1 = await timeToSecond(hora)
                    var time2 = await timeToSecond("04:00:00") // gmt -4

                    var diff = time1 - time2

                    const timeFinal = await secondToTime(diff)

                    const date = ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + '-' + ano + " " + timeFinal;
                    const lastInsertPower = await Repositorie.listPower(line[2])

                    const date1 = new Date(date);
                    const date2 = new Date(lastInsertPower);

                    if (date1.getTime() > date2.getTime()) {
                        await Repositorie.insertPower(line)
                    }
                })
            }

        } catch (error) {
            throw new InternalServerError('No se pudo ejecutar el robot OnStopp.')
        }
    }

    async listProsegurMaintenance() {
        try {

            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox'],
            })

            const page = await browser.newPage()
            await page.goto('https://localizacion.prosegur.com/login?origin=subdomain&timezone=3', { waitUntil: 'networkidle0' })

            let reqPath = path.join(__dirname, '../../')
            await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: reqPath });
            await page.type('#nombre', process.env.PROSEGUR_MAIL)
            await page.type('#pass', process.env.PROSEGUR_PASSWORD)
            await page.click('#btn-submit')
            await page.waitForNavigation()

            await page.goto('https://localizacion.prosegur.com/informes/mantenimientos', { waitUntil: 'networkidle0' })

            const dtInit = await page.$eval("#dateInit", (input) => {
                return input.getAttribute("value")
            });

            const dtEnd = await page.$eval("#dateEnd", (input) => {
                return input.getAttribute("value")
            });

            await page.click(`select [value="TODOS"]`)
            await page.waitForTimeout(3000)

            await page.click('#button_generar_excel')
            await page.waitForTimeout(10000)
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
            throw new InternalServerError('No se pudo ejecutar el robot de mantenimiento.')
        }
    }

    async listProsegurDistance() {
        try {

            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox'],
            })

            const page = await browser.newPage()
            await page.goto('https://localizacion.prosegur.com/login?origin=subdomain&timezone=3', { waitUntil: 'networkidle0' })

            let reqPath = path.join(__dirname, '../../')
            await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: reqPath });
            await page.type('#nombre', process.env.PROSEGUR_MAIL)
            await page.type('#pass', process.env.PROSEGUR_PASSWORD)
            await page.click('#btn-submit')
            await page.waitForNavigation()

            await page.goto('https://localizacion.prosegur.com/informes/distancias-recorridas', { waitUntil: 'networkidle0' })

            await page.click(`select [value="TODOS"]`)
            await page.waitForTimeout(2000)

            await page.click('#button_generar')
            await page.waitForTimeout(30000)

            await page.waitForNavigation()


            await page.click(`#DataTables_Table_0_wrapper > div.top > div.dt-buttons > button`)
            await page.waitForTimeout(10000)
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
            console.log(error);
            return false
        }
    }

    async listProsegurOffice() {
        let file = []
        try {
            const browser = await puppeteer.launch({
                args: ['--lang=pt-BR', '--no-sandbox'],
                headless: false,
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

            let reqPath = path.join(__dirname, '../../')
            await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: reqPath });
            await page.goto('https://smart.prosegur.com/smart-individuo/login.html#!/', { waitUntil: 'networkidle0' })
            await page.type('#username', process.env.PROSEGUR_MAIL)
            await page.type('#password', process.env.PROSEGUR_PASSWORD)
            await page.click('#btnLogin')

            await page.waitForNavigation()

            await page.goto('https://smart.prosegur.com/smart-individuo/#!/activities', { waitUntil: 'networkidle0' })
            await page.waitForTimeout(2000)

            await page.click('body > div.container-fluid.after-navbar > div.row.with-margin-top > ng-view > div > div > div > legend > div.col-lg-12.col-md-12.col-sm-12.col-xs-12.export.text-right > a')
            await page.waitForTimeout(2000)

            await page.click('body > div.modal.fade.in > div > div > div.modal-footer > div > div > button:nth-child(2)')

            await page.waitForTimeout(10000)

            await browser.close()

            fs.readdirSync(reqPath).forEach(fil => {
                if (fil.match(/MELISSA.WINCKLER@AMERICANEUMATICOS.COM.*/)) {
                    file.push(fil)
                }
            });

            const arrData = excelToJson({
                sourceFile: file[0]
            });

            const users = await RepositorieUser.list()

            for (const line of arrData["Reporte de Eventos"]) {
                if (line["F"] && line["E"] != 'Instalação') {

                    let offices = [
                        ["33182", "13"],
                        ["33183", "13"],
                        ["30829", "13"],
                        ["33181", "13"],
                        ["33180", "13"],
                        ["E0885", "13"],
                        ["23", "07"],
                        ["27383", "01"],
                        ["23108", "03"],
                        ["CALLE RUTA INTERNACIONAL AV. LUIS MARIA ARGAÑA-", "N/D"],
                        ["31606", "02"],
                        ["24735", "04"],
                        ["31602", "02"],
                        ["PWSSA1792", "05"],
                        ["PWSSA1810", "05"],
                    ]

                    let months = [
                        ["jan", "01"],
                        ["fev", "02"],
                        ["mar", "03"],
                        ["abr", "04"],
                        ["mai", "05"],
                        ["jun", "06"],
                        ["jul", "07"],
                        ["ago", "08"],
                        ["set", "09"],
                        ["out", "10"],
                        ["nov", "11"],
                        ["dez", "12"],
                    ]

                    let event = {
                        date: line["A"],
                        type: line["B"],
                        contract: line["E"],
                        user: line["F"],
                        office: '00'
                    }

                    const user = users.find(user => user.code == event.user && user.contract == event.contract)
                    if (user) event.user = user.name

                    const office = offices.find(office => office[0] == event.contract)

                    const lastInsert = await Repositorie.listOffice(event.office)

                    let splice = event.date.split("/")
                    const month = months.find(month => month[0] == splice[1])
                    let splice2 = splice[2].split(" ")
                    let date = `${splice2[0]}-${month[1]}-${splice[0]} ${splice2[1]}`

                    let date1 = new Date(lastInsert)
                    let date2 = new Date(date)

                    if (date1.getTime() < date2.getTime()) {
                        event.date = date
                        event.office = office[1]

                        console.log(event);
                        await Repositorie.insertOffice(event)
                    }
                }
            }
            fs.unlinkSync(file[0])
        } catch (error) {
            fs.unlinkSync(file[0])
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
                    "DC6",
                    "3587",
                    "232",
                    "ANSA3587"
                ]
            ]



            for (const login of logins) {

                const browser = await puppeteer.launch({
                    headless: false,
                    args: ['--no-sandbox', '--disable-dev-shm-usage']
                })

                const page = await browser.newPage()
                await page.goto('https://webalarme.com.br/', { waitUntil: 'networkidle0' })
                await page.type('body > div.login.ng-scope > div.content > form > div.row.form-group.inline-fields.ng-scope > div.field.margin-right-10-percent > input', provider)
                await page.type('body > div.login.ng-scope > div.content > form > div.row.form-group.inline-fields.ng-scope > div:nth-child(2) > input', login[2])
                await page.type('body > div.login.ng-scope > div.content > form > div:nth-child(4) > div.form-group > div > input', login[3])
                await page.click('body > div.login.ng-scope > div.content > form > div.form-actions.padding-login > button')
                await page.waitForNavigation()

                await page.goto('https://webalarme.com.br/#!/events', { waitUntil: 'networkidle0' })
                page.setDefaultNavigationTimeout(0);
                await page.waitForTimeout(4000)

                const data = await page.evaluate(() => {
                    const tdsNeumaticos = Array.from(document.querySelectorAll('body > div.page-wrapper.ng-scope > div.page-container > div.page-content-wrapper > div > div.col-12.ng-scope > div > div.portlet-body > div '),
                        row => Array.from(row.querySelectorAll('div > div > div.mt-comment, -body > div.mt-comment-text.ng-binding.ng-scope, td'),
                            cell => cell.innerText))
                    return tdsNeumaticos
                })
                await browser.close()

                for (const object of data) {

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

                        if (typeof line[1] !== "undefined") {
                            const dt = line[1].split(" ")[0]
                            const time = line[1].split(" ")[1]
                            const lastInsert = await Repositorie.listInviolavel(office)

                            var dia = dt.split("/")[0];
                            var mes = dt.split("/")[1];
                            var ano = dt.split("/")[2];

                            const date = ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + " " + time;

                            let date1 = new Date(date)
                            let date2 = new Date(lastInsert)

                            console.log(date1);
                            console.log(date2);

                            if (date1.getTime() > date2.getTime()) {
                                await Repositorie.insertInviolavel(title, date, line[2], login[0])
                            }
                        }
                    })
                }
            }

        } catch (error) {
            throw new InternalServerError('No se pudo ejecutar el robot de seguridad de la inviolavel.')
        }
    }


    async printPowerBi(url, path) {
        try {

            const browser = await puppeteer.launch({
                headless: true,
                slowMo: 2000,
                args: ['--no-sandbox'],
                defaultViewport: null
            })

            const page = await browser.newPage()
            page.setDefaultNavigationTimeout(0)
            page.setDefaultTimeout(0)

            await page.goto(url, { waitUntil: 'load', timeout: 0 }) //networkidle0

            await page.setViewport({ height: 1080, width: 1920 });

            if (url.includes('app.powerbi.com')) {
                await page.waitForTimeout(15000)
                await page.click('#fullScreenIcon')
            }

            await page.pdf({
                path: `${path}.pdf`, format: "A1", height: 1080, width: 1920, landscape: true
            });

            await scissors(`${path}.pdf`).crop({ b: 500, t: 500 })

            await browser.close();

            return true
        } catch (error) {
            throw new InternalServerError(error)
        }
    }
}

module.exports = new WebScraping