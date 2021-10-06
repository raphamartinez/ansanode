const SurveyMonkey = require('survey-monkey')
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path')
const puppeteer = require('puppeteer')
const Repositorie = require('../repositories/surveymonkey')

const pluck = (object, ...keys) => {

    const newObject = {};
    keys.forEach(key => newObject[key] = object[key])
    return newObject;
};

class Surveymonkey {


    async ListResponse() {

        const accessToken = `UZh9sb9A3e2P4GuzW9qyo48phxm3SYLwpscBR-8UGd-mr0oGdzro-QxFu4knWN.yDRsAfCSS-qDFlZfS8PyGnSund2qKCWzi8QFZnAj0JGDBKHogh.0o92KxUapPeIj7`

        try {
            const api = new SurveyMonkey(accessToken)
            // const responses = await api.getSurvayResponses('285770536')

            for (var id_page = 1; id_page <= 24; id_page++) {
                console.log(id_page);
                const data = await fetch(`https://api.surveymonkey.com/v3/surveys/285770536/responses?page=${id_page}&per_page=50`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                const responses = await data.json();
                const browser = await puppeteer.launch({
                    headless: true,
                    ignoreHTTPSErrors: true
                })
console.log(responses);
                responses.data.forEach(async obj => {
                    let arrdata = []

                    const response = await api.getSurvayResponseDetails('285770536', obj.id)
                    if (response.pages[0].questions[0].answers[0] !== undefined && response.pages[20].questions[0]) {

                        const asset = {
                            name: response.pages[1].questions[0].answers[0].text,
                            plate: response.pages[0].questions[1].answers[0].text,
                            url: response.pages[20].questions[0].answers[0].download_url,
                            responseId: obj.id
                        }
                        arrdata.push(asset)


                        // https.get(asset.url, resp => resp.pipe(fs.createWriteStream(`./tmp/ativos/ativo_${asset.plate}.jpg`)));
                        // request({ url: asset.url, encoding: null }, (err, resp, buffer) => {
                        //     fs.writeFile(`./tmp/ativos/ativo_${asset.plate}.jpg`,buffer, (error) => {
                        //         if(!error) {
                        //             console.log("image write succesfully!");
                        //         }else{
                        //             console.log(error);
                        //         }
                        //     });
                        // });

                        const page = await browser.newPage()
                        page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');

                        let reqPath = path.join(__dirname, '../../tmp/ativos/')
                        await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: reqPath });

                        const cookies = [
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1633541747,
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
                                "expirationDate": 1665098639,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "_ga",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                "session": false,
                                "storeId": "0",
                                "value": "GA1.2.533201936.1633443083",
                                "id": 2
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1633628087,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "_gid",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                "session": false,
                                "storeId": "0",
                                "value": "GA1.2.1450466649.1633443083",
                                "id": 3
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1664979333,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "_hjid",
                                "path": "/",
                                "sameSite": "lax",
                                "secure": false,
                                "session": false,
                                "storeId": "0",
                                "value": "5c0ceefe-734d-4c12-9760-5e36be0a39a6",
                                "id": 4
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
                                "value": "aGx4f14g7Ym26AkA_2BGf_2FdnYYMqJ6Mwzjydi_2B_2FmbDCdf8gyrqWe5hUKJ7_2FbKT5QXhVjYtf7VfuzaqtQXN74ORmd4ZWeWBUs7IgrdeYtr8YIV8OOYN0K5K_2BcT0Und81e9y",
                                "id": 5
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1665077686.322698,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "attr_multitouch",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"3ONhTlZnMNry61HYxgykhDQtrB8=\"",
                                "id": 6
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
                                "value": "T5IHlBt_2Fb2jPZJpM0kR4A8paHRAPEAAB6ObNojeEJ1RjNPKrszwHqhzUqqqBgW_2BSEWSImWHMMkzsBDSekDrVxdbtYqaGaAJNQRrDYkAa6TnGrIargZklnhtwy98b27_2B4z76Ed7gdyvbqunOjoYrYrxablg0ysBVD1CnSoCkq1U_2FabyTqJ_2FBtKzgKuE_2FUz4s4F_2BAicUwZKdTAJ_2BygzcmYM9NHEYaO9SIx3JibJLlA6jZ7x3w5dXJEJiEWCIqiQDVNKZq4_2BMOcv3cLro6zQwKy2c_2FZjiOYdw3NrUa88GO9Xw2fnZ5CRvSg_2FbtH5qMmxuNY",
                                "id": 7
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1641317686.322803,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "cdp_seg",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"uc108+nqDKgy9s8RuifpmIjDMdg=\"",
                                "id": 8
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1649871281.860103,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "cfu",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "UUAfsJH4J9fxf0_2BJn_2F_2BSWJL4HMgDuYnaVVTJksJ_2Fx1A_3D",
                                "id": 9
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1633543486.322843,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "ep201",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"1LV1LEV+WbcRNAgYKANL09WbfzU=\"",
                                "id": 10
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1641317686.322892,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "ep202",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"T3XiIW0PJS2tCIA0w9Iw1s60y/4=\"",
                                "id": 11
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1641317686.32293,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "ep203",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"Yt0CxlRIo2VhySaGxx9M6X2QD9c=\"",
                                "id": 12
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
                                "id": 13
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1633628084.351195,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "sm_dv",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "SvOF7Sk90bIMloQX1zHnJ7unpZvNKKacwRiuGWapty8aLjUaFWc7zwfCe8DdYhPZ8DD8id3iW1eaQWg5975kkQ_3D_3D",
                                "id": 14
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
                                "id": 15
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1641317685.992605,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "smasm",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "1065.2504.1593710325|1114.2650.1597702724|1272.3070.1604680921|1292.3115.1606159049|1480.3564.1628801654|1536.3711.1623160990|1608.3914.1624645123|1613.3925.1623792035|1616.3932.1627572112|1647.4017.1627572112|1651.4025.1627572112|1702.4162.1631212072|1781.4334.1632147524",
                                "id": 16
                            },
                            {
                                "domain": "pt.surveymonkey.com",
                                "expirationDate": 1649093687,
                                "hostOnly": true,
                                "httpOnly": false,
                                "name": "OptanonConsent",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "isGpcEnabled=0&datestamp=Wed+Oct+06+2021+14%3A34%3A47+GMT-0300+(Hor%C3%A1rio+Padr%C3%A3o+de+Bras%C3%ADlia)&version=6.23.0&isIABGlobal=false&hosts=&consentId=1665cb64-974e-44d9-af3d-fdc7e4195b63&interactionCount=0&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A0&AwaitingReconsent=false",
                                "id": 17
                            }
                            ]
                        page.on('response', resp => {
                            const data = resp.headers()
                            const result = JSON.stringify(pluck(data, 'content-disposition'))
                            const namestring = result.split('filename=')
                            if (namestring.length > 0) {
                                console.log(namestring);
                                if (namestring[1].indexOf('"') !== -1) {
                                    const removeasset = namestring[1].split('"')
                                    const name = removeasset[1].split("\\")
                                    // console.log(name[0]);
                                    // console.log(resp._url);

                                    let line = arrdata.find(dt => dt.url === resp._url)

                                    line.systemurl = `tmp/uploads/${name[0]}`
                                    Repositorie.insert(obj)
                                }
                            }
                        });

                        await page.setCookie(...cookies);

                        await page.goto(asset.url, { waitUntil: 'networkidle2' })
                        await page.close()
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Surveymonkey