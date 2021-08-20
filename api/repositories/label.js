const query = require('../infrastructure/database/queries')
const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Label {

    async insert(label) {
        try {
            const sql = 'INSERT INTO ansa.label (code, provider, application) values (?, ?, ?)'
            const result = await query(sql, [label.code, label.provider, label.application])

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo ingresar el login en la base de datos')
        }
    }


    list() {
        try {
            const sql = 'SELECT * FROM label'
            return query(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }


    listItemLabel() {
        try {
            const sql = `SELECT I.Code as artcode,I.Labels AS labelcode, Ig.Name AS itemgroup, La.Name AS labelname
            FROM Item I
            INNER JOIN ItemGroup Ig ON I.ItemGroup = Ig.Code
            INNER JOIN Label La ON I.Labels = La.Code
            Group BY I.Labels
            ORDER BY I.Labels`

            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los login')
        }
    }
}

module.exports = new Label()