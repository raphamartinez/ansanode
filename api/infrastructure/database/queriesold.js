const connectionold = require('./connectionold')

const queryold = (query, parameters = '') => {
    return new Promise(
        (resolve, reject) => {
            connectionold.query(query, parameters, (errors, results, fields) => {
            if (errors) {
                reject(errors)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = queryold