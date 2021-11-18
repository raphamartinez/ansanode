const SurveyMonkey = require('survey-monkey')
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path')
const puppeteer = require('puppeteer')
const Repositorie = require('../repositories/patrimony')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const aws = require('aws-sdk')
const s3 = new aws.S3()

const cookies = [
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1637016779,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_dc_gtm_UA-56526-1",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "1",
        "id": 1
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1668573673,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "GA1.2.987632041.1637016414",
        "id": 2
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1637103121,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_gid",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "GA1.2.1511861812.1637016414",
        "id": 3
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1637018346,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_hjFirstSeen",
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "1",
        "id": 4
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1668552515,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_hjid",
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "65f54973-9fcb-4935-9ed3-d0b7678f9f6f",
        "id": 5
    },
    {
        "domain": ".surveymonkey.com",
        "hostOnly": false,
        "httpOnly": true,
        "name": "apex__sm",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": "klChwJPv0cyqHdbOOJ_2FuKj3B6pTgZko_2F74DzlwZ8WgtEdXKL0NQT47QJ1S97LtDpq_2B_2F6No5rj5OAfJchewOsGiG1NHBfOiOLrxIVKg3Lw9mMZRGeObQftmAYyLZZezg_2B",
        "id": 6
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1668552722.306623,
        "hostOnly": false,
        "httpOnly": false,
        "name": "attr_multitouch",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "\"ny/bIBDJWSH+8RUQbOg1ROlxnxQ=\"",
        "id": 7
    },
    {
        "domain": ".surveymonkey.com",
        "hostOnly": false,
        "httpOnly": true,
        "name": "auth",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": "gvnanlWBVSoqx90kA_2FXpY2GRgmd83_2FDBJrceXzKC2WaFeNo_2BfBhG_2B5c_2FHpqZG_2FebIVle8EFM8fsUJTjNLpMTIwQ2X_2FAxMoSYI3mldZ8ieyJMrKU78qsj4zF0hd_2FYKiztgL9SZdFvSVPnmC4o_2FBx596wz67frjaCh8GmrGVTXYt9dV8WXg9Hz47YCE23LI01Jx1YAhuEbCX6QUDhj2IOWO2YQzUYbK7tc06LHjoh6f9XFhEP6vzBOzj7bhABtJi_2BuUQauU8hygHEZV1hin_2F_2BqciQD2Os5yx01kZ_2FAaV5dWAnqkO7n3V4zs_2FJdEqWuqOsP",
        "id": 8
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1644792722.306769,
        "hostOnly": false,
        "httpOnly": false,
        "name": "cdp_seg",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "\"+hw6z+segAvSaYHL4JZr/1XSPmg=\"",
        "id": 9
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1653346107.969667,
        "hostOnly": false,
        "httpOnly": false,
        "name": "cfu",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "UUAfsJH4J9fxf0_2BJn_2F_2BSWJL4HMgDuYnaVVTJksJ_2Fx1A_3D",
        "id": 10
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1637018522.306836,
        "hostOnly": false,
        "httpOnly": false,
        "name": "ep201",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "\"5qmTVdDKm4tnu/YMuF8QV4LML2c=\"",
        "id": 11
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1644792722.306894,
        "hostOnly": false,
        "httpOnly": false,
        "name": "ep202",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "\"/x+lC+UM/ZZwzmIMc/iGOMM45Ps=\"",
        "id": 12
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1644792722.306949,
        "hostOnly": false,
        "httpOnly": true,
        "name": "ep203",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "\"NU9C1DwhIa+x1vpfVsSZ2mcjRu0=\"",
        "id": 13
    },
    {
        "domain": ".surveymonkey.com",
        "hostOnly": false,
        "httpOnly": true,
        "name": "sm_dc",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": "0",
        "id": 14
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1637102908.969947,
        "hostOnly": false,
        "httpOnly": true,
        "name": "sm_dv",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "6k9RLCPEq7YFjqvR_2F37PHoPsPzAjcaM8bxJgX99jLcqtgnmzjb50buQohl2y4JpzImF0SbWaxLyGXD9OE5csqg_3D_3D",
        "id": 15
    },
    {
        "domain": ".surveymonkey.com",
        "hostOnly": false,
        "httpOnly": true,
        "name": "sm_rec",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": "UserID=109473642&Username=AmericaNeumaticos&PackageID=36&LanguageID=17",
        "id": 16
    },
    {
        "domain": ".surveymonkey.com",
        "expirationDate": 1644792719.010634,
        "hostOnly": false,
        "httpOnly": false,
        "name": "smasm",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "1065.2504.1593710325|1114.2650.1597702724|1480.3564.1628801654|1536.3711.1623160990|1608.3914.1624645123|1616.3932.1627572112|1647.4017.1627572112|1651.4025.1627572112|1702.4162.1631212072|1724.4211.1633824908|1831.4436.1636232281",
        "id": 17
    },
    {
        "domain": "pt.surveymonkey.com",
        "expirationDate": 1652568719,
        "hostOnly": true,
        "httpOnly": false,
        "name": "OptanonConsent",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "isGpcEnabled=0&datestamp=Mon+Nov+15+2021+19%3A51%3A59+GMT-0300+(Brasilia+Standard+Time)&version=6.23.0&isIABGlobal=false&hosts=&consentId=4ffae8cc-f08c-446a-a243-59797e9a5eb8&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A0&AwaitingReconsent=false",
        "id": 18
    }
]
class Surveymonkey {

    listImages(id) {
        try {
            return Repositorie.listImages(id)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las images.')
        }
    }

    listDetails(id) {
        try {
            return Repositorie.listDetails(id)

        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar las images.')
        }
    }

    async ListResponseFirst() {

        const accessToken = `UZh9sb9A3e2P4GuzW9qyo48phxm3SYLwpscBR-8UGd-mr0oGdzro-QxFu4knWN.yDRsAfCSS-qDFlZfS8PyGnSund2qKCWzi8QFZnAj0JGDBKHogh.0o92KxUapPeIj7`

        try {
            const api = new SurveyMonkey(accessToken) // 296889408 e 285770536
            // const responses = await api.getSurvayResponses('285770536')
            // const responses = await api.getSurveyList()

            // console.log(responses);
            // for (var id_page = 1; id_page <= 24; id_page++) {
            let id_page = 1
            console.log(id_page);
            const data = await fetch(`https://api.surveymonkey.com/v3/surveys/285770536/responses?page=${id_page}&per_page=50`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            const responses = await data.json();

            responses.data.forEach(async obj => {
                // for (let obj of responses.data) {

                const browser = await puppeteer.launch({
                    headless: true,
                    ignoreHTTPSErrors: true
                })
                const page = await browser.newPage()
                await page.setDefaultNavigationTimeout(0);

                let arrdata = []

                const response = await api.getSurvayResponseDetails('285770536', obj.id)
                if (response.pages[0].questions[0].answers[0] !== undefined && response.pages[20].questions[0]) {

                    let office
                    let type
                    let description
                    let details = []
                    let detail
                    let note

                    switch (response.pages[0].questions[0].answers[0].choice_id) {
                        case '3192040769':
                            office = "02"
                            break
                        case '3192040765':
                            office = "01"
                            break
                        case '3192040766':
                            office = "06"
                            break
                        case '3192040767':
                            office = "03"
                            break
                        case '3192040768':
                            office = "07"
                            break
                        case '3192040770':
                            office = "04"
                            break
                        case '3192040771':
                            office = "10"
                            break
                        case '3192040772':
                            office = "13"
                            break
                        case '3192040774':
                            office = "05"
                            break
                        case '3192040775':
                            office = "12"
                            break
                        case '3192040773':
                            office = "RECAPAR"
                            break
                        case '3275850232':
                            office = "LOGISTICA"
                            break
                        case '3376725153':
                            office = "AVARIADOS"
                            break
                        case '3376725154':
                            office = "NUEVOS - NUNCA UTILIZADOS"
                            break
                        case '3383468493':
                            office = "11"
                            break
                        case '3383468493':
                            office = "04"
                            break
                        default:
                            office = "00"
                            break
                    }

                    switch (response.pages[1].questions[0].answers[0].choice_id) {
                        case '3192439188':
                            type = "Alineadora"
                            description = response.pages[2].questions[0].answers[0].text

                            if (response.pages[16].questions[0] && response.pages[16].questions[0].answers[0]) {
                                console.log('ENTROU PAG 16');

                                detail = {
                                    title: `Plaqueta - Sensor 1`,
                                    description: response.pages[16].questions[0].answers[0].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[16].questions[0] && response.pages[16].questions[0].answers[1]) {
                                detail = {
                                    title: `Plaqueta - Sensor 2`,
                                    description: response.pages[16].questions[0].answers[1].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[16].questions[0] && response.pages[16].questions[0].answers[2]) {
                                detail = {
                                    title: `Plaqueta - Sensor 3`,
                                    description: response.pages[16].questions[0].answers[2].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[16].questions[0] && response.pages[16].questions[0].answers[3]) {
                                detail = {
                                    title: `Plaqueta - Sensor 4`,
                                    description: response.pages[16].questions[0].answers[3].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[16].questions[0] && response.pages[16].questions[0].answers[4]) {
                                detail = {
                                    title: `CPU`,
                                    description: response.pages[16].questions[0].answers[4].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[16].questions[7] && response.pages[16].questions[7].answers[0]) {
                                detail = {
                                    title: `Descrición o observacion adicional`,
                                    description: response.pages[16].questions[7].answers[0].text
                                }

                                details.push(detail)
                            }

                            break
                        case '3192439189':
                            type = "Balanceadora"
                            description = response.pages[3].questions[0].answers[0].text
                            break
                        case '3192439190':
                            type = "Calibrador"
                            description = response.pages[4].questions[0].answers[0].text
                            break
                        case '3192439191':
                            type = "Cañón de inflado"
                            description = response.pages[5].questions[0].answers[0].text
                            break
                        case '3192439192':
                            type = "Compressor"
                            description = response.pages[6].questions[0].answers[0].text
                            break
                        case '3192439193':
                            type = "Desmontadora"
                            description = response.pages[7].questions[0].answers[0].text
                            break
                        case '3192439194':
                            type = "Elevador"
                            description = response.pages[8].questions[0].answers[0].text
                            break
                        case '3192439195':
                            type = "Gabineta da Alineadora"
                            description = response.pages[9].questions[0].answers[0].text
                            break
                        case '3192439196':
                            type = "Gato Hidráulico"
                            description = response.pages[10].questions[0].answers[0].text
                            break
                        case '3192439197':
                            type = "Lavadora de cubiertas"
                            description = response.pages[11].questions[0].answers[0].text
                            break
                        case '3192439198':
                            type = "Prensa Hidráulica"
                            description = response.pages[12].questions[0].answers[0].text
                            break
                        case '3192439199':
                            type = "Rampa"
                            description = response.pages[13].questions[0].answers[0].text
                            break
                        case '3192439200':
                            type = "Rectificador (a)"
                            description = response.pages[14].questions[0].answers[0].text
                            break
                        case '3192439201':
                            type = "Regulador de Farol"
                            description = response.pages[15].questions[0].answers[0].text
                            break
                        case '3193600760':
                            type = "Caja/mesa de Herramienta"
                            description = `Descripciones adicionales`

                            if (response.pages[17].questions[0] && response.pages[17].questions[0].answers[0]) {

                                detail = {
                                    title: `Mesa de Herramientas`,
                                    description: response.pages[17].questions[0].answers[0].text
                                }
                                details.push(detail)
                            }

                            if (response.pages[17].questions[0] && response.pages[17].questions[0].answers[1]) {

                                detail = {
                                    title: `Caja de Herramientas`,
                                    description: response.pages[17].questions[0].answers[1].text
                                }

                                details.push(detail)
                            }

                            break
                        case '3275854492':
                            type = "Teléfono"
                            description = `Descripciones adicionales`

                            if (response.pages[19].questions[0] && response.pages[19].questions[0].answers[0]) {
                                console.log('ENTROU PAG 19');

                                detail = {
                                    title: `Nombre de la persona que esta con el celular`,
                                    description: response.pages[19].questions[0].answers[0].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[19].questions[0] && response.pages[19].questions[0].answers[1]) {
                                detail = {
                                    title: `Marca y Modelo`,
                                    description: response.pages[19].questions[0].answers[1].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[19].questions[0] && response.pages[19].questions[0].answers[2]) {
                                detail = {
                                    title: `Numero IMEI do aparelho (*#06#)`,
                                    description: response.pages[19].questions[0].answers[2].text
                                }

                                details.push(detail)
                            }

                            break
                        case '3275861799':
                            type = "Extintor"
                            description = `Descripciones adicionales`

                            if (response.pages[18].questions[0] && response.pages[18].questions[0].answers[0]) {

                                detail = {
                                    title: `Nombre del provedor`,
                                    description: response.pages[18].questions[0].answers[0].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[18].questions[0] && response.pages[18].questions[0].answers[1]) {
                                detail = {
                                    title: `Vencimiento (mes y año)`,
                                    description: response.pages[18].questions[0].answers[1].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[18].questions[0] && response.pages[18].questions[0].answers[2]) {
                                detail = {
                                    title: `Cual contenido (PQS ABC / CO2 / EM)`,
                                    description: response.pages[18].questions[0].answers[2].text
                                }

                                details.push(detail)
                            }

                            if (response.pages[18].questions[0] && response.pages[18].questions[0].answers[3]) {

                                detail = {
                                    title: `Cual kg?`,
                                    description: response.pages[18].questions[0].answers[3].text
                                }

                                details.push(detail)
                            }

                            break
                        default:
                            type = response.pages[1].questions[0].answers[0].text
                            break
                    }

                    if (response.pages[20].questions[3] && response.pages[20].questions[3].answers[0]) note = response.pages[20].questions[3].answers[0].text

                    const asset = {
                        name: response.pages[1].questions[0].answers[0].text,
                        office: office,
                        plate: response.pages[0].questions[1].answers[0].text,
                        responseId: obj.id,
                        type: type,
                        description: description,
                        note: note,
                        title: 'Inventario Maquinaria e Activos Fijos',
                        url: []
                    }

                    if (response.pages[20].questions[0]) asset.url.push(response.pages[20].questions[0].answers[0].download_url)
                    if (response.pages[20].questions[1]) asset.url.push(response.pages[20].questions[1].answers[0].download_url)
                    if (response.pages[20].questions[2]) asset.url.push(response.pages[20].questions[2].answers[0].download_url)
                    if (response.pages[16].questions[1]) asset.url.push(response.pages[16].questions[1].answers[0].download_url)
                    if (response.pages[16].questions[2]) asset.url.push(response.pages[16].questions[2].answers[0].download_url)
                    if (response.pages[16].questions[3]) asset.url.push(response.pages[16].questions[3].answers[0].download_url)
                    if (response.pages[16].questions[4]) asset.url.push(response.pages[16].questions[4].answers[0].download_url)
                    if (response.pages[16].questions[5]) asset.url.push(response.pages[16].questions[5].answers[0].download_url)
                    if (response.pages[16].questions[6]) asset.url.push(response.pages[16].questions[6].answers[0].download_url)

                    let check = await Repositorie.validatePatrimony(asset.plate)
                    if (!check) {
                        let id = await Repositorie.insert(asset)
                        asset.id = id
                    } else {
                        asset.id = check.id_companyassets
                    }

                    console.log(details);
                    details.forEach(async obj => {
                        let checkdetails = await Repositorie.validateDetails(asset.plate, obj.title)
                        console.log("checkdetails" + checkdetails);
                        if (!checkdetails) {
                            Repositorie.insertDetails(obj.description, obj.title, asset.id)
                        }
                    })

                    arrdata.push(asset)

                    page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');

                    let reqPath = path.join(__dirname, '../../tmp/ativos/')
                    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: reqPath });

                    await page.on('response', async resp => {

                        let content = resp._headers['content-disposition']
                        let url = resp['_url']

                        let index = content.search("=")
                        let contentbd = content.slice(index + 2, content.length - 1)

                        if (contentbd == "image.jpg") {

                            contentbd = `img${asset.plate}_${asset.office}.jpg`
                            fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                if (err) console.log(`Error on rename file: ${err}`);
                            })

                        }

                        let articulo = arrdata.find(as => as.url.find(u => u === url))
                        if (articulo) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                    });

                    await page.setCookie(...cookies);

                    console.log(asset.url[0]);
                    console.log(asset.url[1]);
                    console.log(asset.url[2]);
                    console.log(asset.url[3]);
                    console.log(asset.url[4]);
                    console.log(asset.url[5]);
                    console.log(asset.url[6]);
                    console.log(asset.url[7]);

                    page.goto(asset.url[0], {
                        timeout: 0
                    })

                    await page.waitForTimeout(4000)


                    if (asset.url[1]) {
                        const page2 = await browser.newPage()
                        await page2.setDefaultNavigationTimeout(0);

                        page2.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page2.goto(asset.url[1], {
                            timeout: 0
                        })
                    }

                    await page.waitForTimeout(4000)

                    if (asset.url[2]) {
                        const page3 = await browser.newPage()
                        await page3.setDefaultNavigationTimeout(0);

                        page3.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page3.goto(asset.url[2], {
                            timeout: 0
                        })
                    }

                    if (asset.url[3]) {
                        const page4 = await browser.newPage()
                        await page4.setDefaultNavigationTimeout(0);

                        page4.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page4.goto(asset.url[3], {
                            timeout: 0
                        })
                    }

                    if (asset.url[4]) {
                        const page5 = await browser.newPage()
                        await page5.setDefaultNavigationTimeout(0);

                        page5.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page5.goto(asset.url[4], {
                            timeout: 0
                        })
                    }

                    if (asset.url[5]) {
                        const page6 = await browser.newPage()
                        await page6.setDefaultNavigationTimeout(0);

                        page6.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page6.goto(asset.url[5], {
                            timeout: 0
                        })
                    }

                    if (asset.url[6]) {
                        const page7 = await browser.newPage()
                        await page7.setDefaultNavigationTimeout(0);

                        page7.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page7.goto(asset.url[6], {
                            timeout: 0
                        })
                    }

                    if (asset.url[7]) {
                        const page8 = await browser.newPage()
                        await page8.setDefaultNavigationTimeout(0);

                        page8.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page8.goto(asset.url[7], {
                            timeout: 0
                        })
                    }
                }
            })

        } catch (error) {
            console.log(error);
        }
    }

    async ListResponseSecond() {

        const accessToken = `UZh9sb9A3e2P4GuzW9qyo48phxm3SYLwpscBR-8UGd-mr0oGdzro-QxFu4knWN.yDRsAfCSS-qDFlZfS8PyGnSund2qKCWzi8QFZnAj0JGDBKHogh.0o92KxUapPeIj7`

        try {
            const api = new SurveyMonkey(accessToken) // 296889408 e 285770536
            // const responses = await api.getSurvayResponses('285770536')
            // const responses = await api.getSurveyList()

            // console.log(responses);
            // for (var id_page = 1; id_page <= 24; id_page++) {
            let id_page = 15
            console.log(id_page);
            const data = await fetch(`https://api.surveymonkey.com/v3/surveys/296889408/responses?page=${id_page}&per_page=50`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            const responses = await data.json();

            // for (let obj of responses.data) {
            responses.data.forEach(async obj => {

                const browser = await puppeteer.launch({
                    headless: true,
                    ignoreHTTPSErrors: true
                })
                const page = await browser.newPage()
                await page.setDefaultNavigationTimeout(0);

                let arrdata = []

                const response = await api.getSurvayResponseDetails('296889408', obj.id)
                if (response.pages[0].questions[0].answers[0] !== undefined && response.pages[2].questions[0]) {

                    let office
                    switch (response.pages[0].questions[0].answers[0].choice_id) {
                        case '3764399526':
                            office = "02"
                            break
                        case '3764399522':
                            office = "01"
                            break
                        case '3764399523':
                            office = "06"
                            break
                        case '3764399524':
                            office = "03"
                            break
                        case '3764399525':
                            office = "07"
                            break
                        case '3764399527':
                            office = "04"
                            break
                        case '3764399528':
                            office = "10"
                            break
                        case '3764399529':
                            office = "13"
                            break
                        case '3764399531':
                            office = "05"
                            break
                        case '3764399532':
                            office = "12"
                            break
                        case '3764399530':
                            office = "RECAPAR"
                            break
                        case '3764399825':
                            office = "LOGISTICA"
                            break
                        case '3764399835':
                            office = "AVARIADOS"
                            break
                        case '3383468493':
                            office = "11"
                            break
                        case '3383468493':
                            office = "04"
                            break
                        default:
                            office = "00"
                            break
                    }

                    let name
                    switch (response.pages[1].questions[0].answers[0].choice_id) {
                        case '3764449167':
                            name = "Martillo de Balanceo"
                            break
                        case '3764449168':
                            name = "Pistola neumática de 1 pulgada"
                            break
                        case '3764449169':
                            name = "Pistola neumática auto"
                            break
                        case '3764449170':
                            name = "Taladro"
                            break
                        case '3764449171':
                            name = "Caja de tubo"
                            break
                        case '3764449172':
                            name = "Gato hidráulico"
                            break
                        case '3764449173':
                            name = "Tubo para camión"
                            break
                        case '3764449174':
                            name = "Llave de caño"
                            break
                        case '3764449175':
                            name = "Llave francesa"
                            break
                        case '3764449176':
                            name = "Llave mixta"
                            break
                        case '3764449177':
                            name = "Pinza de presión"
                            break
                        case '3764449178':
                            name = "Martillo de goma"
                            break
                        case '3764449179':
                            name = "Llave rueda auto"
                            break
                        case '3764449180':
                            name = "Llave de ruedas para camión"
                            break
                        case '3764449181':
                            name = "Barretina de gomería"
                            break
                        case '3764449182':
                            name = "Comprimido de espiral"
                            break
                        case '3764449183':
                            name = "Espirales"
                            break
                        case '3764449184':
                            name = "Saca filtro de aceite"
                            break
                        case '3764449185':
                            name = "Saca Precap"
                            break
                        case '3764449186':
                            name = "Martillo"
                            break
                        case '3764449187':
                            name = "Mazo"
                            break
                        case '3764449188':
                            name = "Destornillador"
                            break
                        case '3764449189':
                            name = "Prensa manual"
                            break
                        case '3764449190':
                            name = "Calibrador de presión neumáticos"
                            break
                        case '3764449191':
                            name = "Tubo de impacto auto"
                            break
                        default:
                            name = response.pages[1].questions[0].answers[0].text
                            break
                    }

                    const asset = {
                        name: name,
                        type: response.pages[1].questions[1].answers[0].text,
                        office: office,
                        plate: response.pages[0].questions[1].answers[0].text,
                        url: [],
                        responseId: obj.id,
                        title: 'Artículos de Pequeño Valor'
                    }

                    if (response.pages[2].questions[0]) asset.url.push(response.pages[2].questions[0].answers[0].download_url)
                    if (response.pages[2].questions[1]) asset.url.push(response.pages[2].questions[1].answers[0].download_url)
                    if (response.pages[2].questions[2]) asset.url.push(response.pages[2].questions[2].answers[0].download_url)

                    let check = await Repositorie.validatePatrimony(asset.plate)
                    if (!check) {
                        let id = await Repositorie.insert(asset)
                        asset.id = id
                    } else {
                        asset.id = check.id_companyassets
                    }

                    arrdata.push(asset)

                    page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');

                    let reqPath = path.join(__dirname, '../../tmp/ativos/')
                    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: reqPath });

                    await page.on('response', async resp => {

                        let content = resp._headers['content-disposition']
                        let url = resp['_url']

                        let index = content.search("=")
                        let contentbd = content.slice(index + 2, content.length - 1)

                        if (contentbd == "image.jpg") {

                            contentbd = `img${asset.plate}_${asset.office}.jpg`
                            fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                if (err) console.log(`Error on rename file: ${err}`);
                            })

                        }

                        let articulo = arrdata.find(as => as.url.find(u => u === url))

                        const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                        if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                    });

                    await page.setCookie(...cookies);

                    console.log(asset.url[0]);
                    console.log(asset.url[1]);
                    console.log(asset.url[2]);

                    page.goto(asset.url[0], {
                        timeout: 0
                    })

                    await page.waitForTimeout(4000)

                    if (asset.url[1]) {
                        const page2 = await browser.newPage()
                        await page2.setDefaultNavigationTimeout(0);

                        page2.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page2.goto(asset.url[1], {
                            timeout: 0
                        })
                    }

                    await page.waitForTimeout(4000)

                    if (asset.url[2]) {
                        const page3 = await browser.newPage()
                        await page3.setDefaultNavigationTimeout(0);

                        page3.on('response', async resp => {

                            let content = resp._headers['content-disposition']
                            let url = resp['_url']

                            let index = content.search("=")
                            let contentbd = content.slice(index + 2, content.length - 1)

                            if (contentbd == "image.jpg") {

                                contentbd = `img${asset.plate}_${asset.office}.jpg`
                                fs.rename('tmp/ativos/image.jpg', `tmp/ativos/${contentbd}`, function (err, data) {
                                    if (err) console.log(`Error on rename file: ${err}`);
                                })

                            }

                            let articulo = arrdata.find(as => as.url.find(u => u === url))

                            const checkimage = await Repositorie.validateImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`)

                            if (articulo && !checkimage) Repositorie.insertImage(`https://informes.americaneumaticos.com.py/tmp/ativos/${contentbd}`, asset.id)

                        });

                        page3.goto(asset.url[2], {
                            timeout: 0
                        })
                    }
                }
            })

        } catch (error) {
            console.log(error);
        }
    }

    async list(offices, types) {
        return Repositorie.list(offices, types)
    }

    async listTypes(offices) {
        return Repositorie.listTypes(offices)
    }

    async insert(files, patrimony, id_login) {
        try {
            const id_patrimony = await Repositorie.insert(patrimony, id_login)

            for (const file of files) {
                await Repositorie.insertImage(file.location, id_patrimony)
            }

            if (patrimony.details) {
                let details = JSON.parse(patrimony.details)

                for (const detail of details) {
                    await Repositorie.insertDetails(detail.value, detail.title, id_patrimony)
                }
            }

            return id_patrimony
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo guardar el archivo.')
        }
    }

    async update(patrimony) {
        try {
            await Repositorie.update(patrimony)

            if (patrimony.details) {
                let details = JSON.parse(patrimony.details)

                for (const detail of details) {
                    await Repositorie.updateDetail(detail)
                }

            }

            return true
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error al actualizar el patrimonio.')
        }
    }

    async insertFile(files, patrimony, id_login) {
        try {

            for (const file of files) {
                await Repositorie.insertImage(file.location, patrimony.id)
            }

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('No se pudo guardar el archivo.')
        }
    }

    async delete(id) {
        try {

            const files = await Repositorie.listImages(id)

            if (files.length > 0) {
                for (const file of files) {
                    s3.deleteObject({
                        Bucket: 'ansarepositorie',
                        Key: file.name
                    }).promise()

                    await Repositorie.deleteImage(file.id)
                }
            }

            await Repositorie.delete(id)

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('Se produjo un error al intentar eliminar el archivo.')
        }
    }

    async deleteImage(id, name) {
        try {
            s3.deleteObject({
                Bucket: 'ansarepositorie',
                Key: name
            }).promise()

            await Repositorie.deleteImage(id)

            return true
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('Se produjo un error al intentar eliminar el archivo.')
        }
    }
}

module.exports = new Surveymonkey