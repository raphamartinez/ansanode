const Repositorie = require('../repositories/file')
const fs = require('fs')
const History = require('./history')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')

/**
 * 
 */
class File {

    async save(file, details, id_login) {
        try {
            const id_file = await Repositorie.insert(file, details, id_login)

            return id_file
        } catch (error) {
            throw new InvalidArgumentError('No se pudo guardar el archivo.')
        }

    }

    async saveoffice(data, id_login) {
        try {
            const id_file = await Repositorie.insertoffice(data, id_login)

            return id_file
        } catch (error) {
            throw new InvalidArgumentError('No se pudo guardar el archivo de Office.')
        }
    }

    async view(id_file) {
        try {
            return Repositorie.view(id_file)
        } catch (error) {
            throw new NotFound('Archivo no encontrado')
        }
    }

    async delete(id_file) {
        try {

            const file = await Repositorie.view(id_file)

            if(file.mimetype !== "application/excel" && file.mimetype !== "application/word" && file.mimetype !== "application/powerpoint"){
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path)
                    await Repositorie.delete(id_file)
                  }else{
                    throw new NotFound('No se encontró el archivo, por lo que se puede eliminar.')
                  }
            }else{
                await Repositorie.delete(id_file)
            }

            return file

        } catch (error) {
            if (error && error.code == 'ENOENT') {
                throw new NotFound('No se encontró el archivo, por lo que se puede eliminar.')
            } else {
                throw new InvalidArgumentError('Se produjo un error al intentar eliminar el archivo.')
            }
        }
    }

    async list(file,id_login) {
        try {

            let history = `Listado de archivos `

            if(file.type === "Todas") {
                delete file.type
            } else{
                history+= `- Tipo: ${file.type} `

            }
            if(file.title === "Todas") {
                delete file.title; 
            }else{
                history+= `- Titulo: ${file.title}.`

            }

            History.insertHistory(history, id_login)
            const data = await Repositorie.list(file)

            data.forEach(obj => {
                if(/\s/.test(obj.filename)){
                    obj.filename = obj.filename.replace(/ /g, "%20")
                }

                if(!obj.size){
                    obj.size = 'WEB'
                } else{
                    obj.size = `${(obj.size / 1024 / 1024).toFixed(2)} Mb`
                }
            })
            
            return data
        } catch (error) {
            throw new InternalServerError('No se pudieron enumerar los archivos.')
        }
    }

    async update(file){
        try {
            const result = await Repositorie.update(file)

            return result
        } catch (error) {
            throw new InvalidArgumentError('No se pudo actualizar el archivo.')
        }
    }
}

module.exports = new File