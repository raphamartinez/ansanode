const queryhbs = require('../infrastructure/database/querieshbs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('../models/error')

class Item {

    listUnion() {
        try {
            const sql = `SELECT it.code, UPPER(it.name) AS name, 'Articulo' as type
                FROM Item it
                UNION 
                SELECT ig.code, UPPER(ig.name) AS name, 'Grupo' as type
                FROM ItemGroup ig
                UNION
                SELECT la.code, UPPER(la.name) AS name, 'Etiqueta' as type
                FROM Label la
                ORDER BY name`
            
            return queryhbs(sql)
        } catch (error) {
            throw new InternalServerError('No se pudieron importar los articulos.')
        }
    }
}

module.exports = new Item()


