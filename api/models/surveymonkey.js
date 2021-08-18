const SurveyMonkey = require('survey-monkey')
const fetch = require('node-fetch');

const Repositorie = require('../repositories/surveymonkey')

class Surveymonkey {


    async ListResponse() {

        const accessToken = `UZh9sb9A3e2P4GuzW9qyo48phxm3SYLwpscBR-8UGd-mr0oGdzro-QxFu4knWN.yDRsAfCSS-qDFlZfS8PyGnSund2qKCWzi8QFZnAj0JGDBKHogh.0o92KxUapPeIj7`

        try {
            const api = new SurveyMonkey(accessToken)
            // const responses = await api.getSurvayResponses('285770536')

            for (var id_page = 19; id_page <= 24; id_page++) {
                console.log(id_page);
                const data = await fetch(`https://api.surveymonkey.com/v3/surveys/285770536/responses?page=${id_page}&per_page=50`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                const responses = await data.json();

                for (const obj of responses.data) {
                    const response = await api.getSurvayResponseDetails('285770536', obj.id)
                    if (response.pages[0].questions[0].answers[0] !== undefined && response.pages[20].questions[0]) {
                        const asset = {
                            name: response.pages[1].questions[0].answers[0].text,
                            plate: response.pages[0].questions[1].answers[0].text,
                            url: response.pages[20].questions[0].answers[0].download_url,
                            responseId: obj.id
                        }
                        console.log(asset.url);
                        // Repositorie.insert(asset)
                    }
                }
            }

            // var request = require('request');
            // request.get(`https://www.surveymonkey.com/analyze/files/download/?survey_id=285770536&files=l759jSqikCVolRAzgamMinGIU_2F1sJlxghtpV2TASuOar5odnRKisIcicT47DqzKO5Kdr215IP5sU0crOJBBt7Q0eTbhjcxjzpwwQ2bP3rRl6m4wzlPJtvMn8s59sKv0qbEp_2FCLH_2FRQCQtSvsgkxYXvHC_2BwQb9O9u_2F_2FOZMDK80yI_3D`, function (error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         fs.writeFile('teste.jpg', body, , (err) => {
            //             console.log(err)
            //         })
            //     }
            // });
            


            //const response = await api.getSurvayResponseDetails('285770536','11727504523')
            //const obj = await api.getSurvayResponse('285770536','11727504523')
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Surveymonkey