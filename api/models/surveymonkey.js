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

                        Repositorie.insert(asset)
                    }
                }
            }


            //const response = await api.getSurvayResponseDetails('285770536','11727504523')
            //const obj = await api.getSurvayResponse('285770536','11727504523')
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Surveymonkey