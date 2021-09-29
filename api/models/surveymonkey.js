const SurveyMonkey = require('survey-monkey')
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path')
const puppeteer = require('puppeteer')


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
                    headless: false
                })

                for (const obj of responses.data) {
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

                        const cookies = [{
                            'name': '_hjFirstSeen',
                            'value': '1', 
                            'domain': 'https://pt.surveymonkey.com' 
                        }, 
                        {
                            'name': 'sm_dv',
                            'value': '2RHE4F12QVMwpSnsCcfRCkYLScDcE8LXb8nKxycSvIwOf9B4pbzdAJW7tENGfzy6BAOwT7Xr1EGH_2FO_2B_2BSo1e7A_3D_3D', 
                            'domain': 'https://pt.surveymonkey.com' 
                        }, 
                        {
                            'name': '_gid',
                            'value': 'GA1.2.1995752450.1632433762', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'apex__sm',
                            'value': 'mqkF3fdrU8GJfAy4Dpa4NagDP2v8pUFbDi28V8Tthe8eeDc2k0bXHpI_2F7hG2AcwNn8_2FXf3tXM7fM57_2B_2BTCe5NPZih_2F3FjgKXoq6sHohq2sDKsgtahljbg6Jjluo19WiM', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'auth',
                            'value': '9M41TonPdF7i4vyZ262UQb6M7JfQIMG4fBJSLYYYYKTjHT_2FwDoRqYplO_2F8vGiatQ8R6t0pyRH_2FBliBhSX7ZhiVBNwFRs81UFOvkHZdK1CvXJdNHuifhIrGCWDTZiY_2FdozDFvS3RyzSxLX0ZhCwuPy8yaugTyeV19NdSAWudFtarKkburpfnNxZZwI9h7qb7CAnLZ9ytsZQDDD0SfOj29bH66yWiErQi0WRmj0KO8yEMLg37g9ezMbXcRtPc4pChEadYCb_2FhToXhS7_2B6jW7IWJIcPqVblvIhCrpjiiRI0zvOkRnn_2BinN0HaVKLqcemAOh', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'sm_dc',
                            'value': '0', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'sm_rec',
                            'value': 'UserID=109473642&Username=AmericaNeumaticos&PackageID=36&LanguageID=17', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'smasm',
                            'value': '1065.2504.1593710325|1114.2650.1597702724|1272.3070.1604680921|1292.3115.1606159049|1480.3564.1628801654|1536.3711.1623160990|1608.3914.1624645123|1613.3925.1623792035|1616.3932.1627572112|1647.4017.1627572112|1651.4025.1627572112|1702.4162.1631212072|1709.4177.1628773901|1781.4334.1632147524', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'cdp_seg',
                            'value': '"r0W5qNFCKN43agz9g/1Ady19wUQ="', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'ep202',
                            'value': '"22twQ/rq2whs50lsqF7fdNLllSc="', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'ep203',
                            'value': '"y2mP2HYGqBo0C3IAUinmhDQmJ4k="', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'OptanonConsent',
                            'value': 'isGpcEnabled=0&datestamp=Fri+Sep+24+2021+15%3A09%3A07+GMT-0300+(Hor%C3%A1rio+Padr%C3%A3o+de+Bras%C3%ADlia)&version=6.23.0&isIABGlobal=false&hosts=&consentId=d1bd06d8-8fef-44fc-9383-dd2fe5cf1435&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A0&AwaitingReconsent=false', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'cfu',
                            'value': 'UUAfsJH4J9fxf0_2BJn_2F_2BSWJL4HMgDuYnaVVTJksJ_2Fx1A_3D', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': '_hjid',
                            'value': 'eac3cfc3-81be-41c7-9887-7d26a75c2aa7', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'attr_multitouch',
                            'value': '"ee0UGeAKMKfD45p9dL9SMNLIGIQ="', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': '_ga',
                            'value': 'GA1.2.257796106.1632433762', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                        {
                            'name': 'cfu',
                            '_ga_JMDBBLT4C7': 'GS1.1.1632506856.1.0.1632506856.0', 
                            'domain': 'https://pt.surveymonkey.com' 
                        },
                    ];

                        await page.setCookie(...[cookies]);

                        await page.goto(asset.url, { waitUntil: 'networkidle0' })

                        await page.close()

                        console.log(asset.url);
                        // Repositorie.insert(asset)
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Surveymonkey