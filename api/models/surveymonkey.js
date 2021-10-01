const SurveyMonkey = require('survey-monkey')
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path')
const puppeteer = require('puppeteer')

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

            for (var id_page = 2; id_page <= 24; id_page++) {
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

                responses.data.forEach(async obj => {

                    const response = await api.getSurvayResponseDetails('285770536', obj.id)
                    if (response.pages[0].questions[0].answers[0] !== undefined && response.pages[20].questions[0]) {
                        const asset = {
                            name: response.pages[1].questions[0].answers[0].text,
                            plate: response.pages[0].questions[1].answers[0].text,
                            url: response.pages[20].questions[0].answers[0].download_url,
                            responseId: obj.id
                        }
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
                                "expirationDate": 1696100306,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "_ga",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "GA1.1.1503069348.1633027992",
                                "id": 1
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1696100306,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "_ga_JMDBBLT4C7",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "GS1.1.1633028306.1.0.1633028306.0",
                                "id": 2
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1633114706,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "_gid",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                "session": false,
                                "storeId": "0",
                                "value": "GA1.2.1688141389.1633027992",
                                "id": 3
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1633030092,
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
                                "expirationDate": 1664564292,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "_hjid",
                                "path": "/",
                                "sameSite": "lax",
                                "secure": false,
                                "session": false,
                                "storeId": "0",
                                "value": "734b1f3a-e933-4d4d-98c5-54cd9cff1fd0",
                                "id": 5
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1634237923.581085,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "apex__sm",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "belz7D3jDyp9CPFfFSgDTg1JbIgrTP9jvEnM7mzSLwYmFdrSeoQ4WzgA5wXwLsSdI1BT9lF7wa9m3ctHdutW4JbZh3YDTWX8HVofluwnS512bhpNNUCynm0YYz6J71o_2B",
                                "id": 6
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1664564323.58115,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "attr_multitouch",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"wmQ7ebtcvMlU0zdlBeDlhZFngI0=\"",
                                "id": 7
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1634237923.581191,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "auth",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "k3RsKITwSh1RU8_2Bi02PbuuePNDLgqLdhUJZ4yAMeqmJljJaQJ39lBG2P0kFMNqSKJ2R_2FXlr_2By7vlphJDeBuCqhWB5Jdnnli_2Bg_2FQaRLFw2oTAEe_2BvoSCGyBJVLq_2BpIRr12CB4PO6leidfwTpUOBgIMJjDRdS1FyJVp5gKfNaIm2WFfYCXwlNIpSKTp4sHdcSf2beuxgjIZ1FJymcOqmQg4IrMWRIkavAwZPwGZ38JhlDKx5R_2BhXSW1nHLi19TCBVzczH2UR792uC39k14v1xdlirwmyJX7KMkxof3UF1QLLQ_3D",
                                "id": 8
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1640804323.581223,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "cdp_seg",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"XOlSGwOw47CgJkL9/Q3eMbSQFxk=\"",
                                "id": 9
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1649357905.136038,
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
                                "expirationDate": 1633030123.581267,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "ep201",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"tO8MqeAybFSyKYdvhk8tUwW7kYY=\"",
                                "id": 11
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1640804323.581297,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "ep202",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"4U7hBb2+K/1C9k5Vp/onPYh9HWw=\"",
                                "id": 12
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1640804323.581322,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "ep203",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "\"aMgqP5CEgUlDNadkPolauZXsJ5I=\"",
                                "id": 13
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1634237923.581346,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "sm_dc",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "0",
                                "id": 14
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1633114684.254173,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "sm_dv",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "SvOF7Sk90bIMloQX1zHnJy_2Fb9Iv9NneScZed90nP5vp2Trhjqw2yiQ8cFM1mg6Y8qWpwrCNmgljQq2nqYSlx0g_3D_3D",
                                "id": 15
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1634237923.581368,
                                "hostOnly": false,
                                "httpOnly": true,
                                "name": "sm_rec",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "UserID=109473642&Username=AmericaNeumaticos&PackageID=36&LanguageID=17",
                                "id": 16
                            },
                            {
                                "domain": ".surveymonkey.com",
                                "expirationDate": 1640804303.161175,
                                "hostOnly": false,
                                "httpOnly": false,
                                "name": "smasm",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "1065.2504.1593710325|1114.2650.1597702724|1272.3070.1604680921|1292.3115.1606159049|1480.3564.1628801654|1536.3711.1623160990|1608.3914.1624645123|1613.3925.1623792035|1616.3932.1627572112|1647.4017.1627572112|1651.4025.1627572112|1702.4162.1631212072|1781.4334.1632147524",
                                "id": 17
                            },
                            {
                                "domain": "pt.surveymonkey.com",
                                "expirationDate": 1648580306,
                                "hostOnly": true,
                                "httpOnly": false,
                                "name": "OptanonConsent",
                                "path": "/",
                                "sameSite": "no_restriction",
                                "secure": true,
                                "session": false,
                                "storeId": "0",
                                "value": "isGpcEnabled=0&datestamp=Thu+Sep+30+2021+15%3A58%3A26+GMT-0300+(Hor%C3%A1rio+Padr%C3%A3o+de+Bras%C3%ADlia)&version=6.23.0&isIABGlobal=false&hosts=&consentId=21254422-dd48-4f37-9a20-7857759edb09&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A0&AwaitingReconsent=false",
                                "id": 18
                            },
                            {
                                "domain": "pt.surveymonkey.com",
                                "hostOnly": true,
                                "httpOnly": true,
                                "name": "session",
                                "path": "/",
                                "sameSite": "lax",
                                "secure": true,
                                "session": true,
                                "storeId": "0",
                                "value": "b6MeEUq8uHRIXk_vJ4OFAKFecnvh8fGVNssE6--2V11c2zLk6rji7xVdruHYpyw6x8RMzkL7F-RcbexKYo7eu4AFlUkAAAAAAAAASsoIVmFHQdhVgjKi_Lh9lIwHX2NzcmZ0X5SMKGI0OWY3NzMwOGY4Mjg5NDBiMDFjNGFjZTIxMzUxZGYzYTNjYzdmM2OUc4eULg",
                                "id": 19
                            },
                            {
                                "domain": "pt.surveymonkey.com",
                                "expirationDate": 1633114705,
                                "hostOnly": true,
                                "httpOnly": false,
                                "name": "upgrade_browser_modal",
                                "path": "/",
                                "sameSite": "unspecified",
                                "secure": false,
                                "session": false,
                                "storeId": "0",
                                "value": "true",
                                "id": 20
                            }
                        ]

                        page.on('response', resp => {

                            const data = resp.headers()
                            const result = JSON.stringify(pluck(data, 'content-disposition'))
                            console.log(result);
                            const namestring = result.split('filename=')
                            if(namestring.length > 0){
                                console.log(namestring);
                                const removeasset = namestring[1].split('"')
                                const name = removeasset[1].split("\\")
                                console.log(name[0]);
    
                                // Repositorie.insert(asset)
                            }
                        });

                        await page.setCookie(...cookies);

                        await page.goto(asset.url, { waitUntil: 'networkidle2' })
                        await page.close()

                        console.log(asset.url);
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Surveymonkey