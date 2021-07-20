const Repositorie = require('../repositories/file')
const fs = require('fs')
const History = require('./history')

class File {

    async save(file, details, id_login) {
        try {
            const id_file = await Repositorie.insert(file, details, id_login)

            return id_file
        } catch (error) {
            next(error)
        }

    }

    async saveoffice(data, id_login) {
        try {
            console.log(data);
            const id_file = await Repositorie.insertoffice(data, id_login)

            return id_file
        } catch (error) {
            next(error)
        }

    }

    async view(id_file) {
        try {
            return Repositorie.view(id_file)
        } catch (error) {
            next(error)
        }
    }

    async delete(id_file) {
        try {

            const file = await Repositorie.view(id_file)

            if(file.mimetype !== "application/excel" && file.mimetype !== "application/word" && file.mimetype !== "application/powerpint"){
                fs.unlinkSync(file.path)
            }

            await Repositorie.delete(id_file)

            return file

        } catch (error) {
            if (error && error.code == 'ENOENT') {
                next("File doesn't exist, won't remove it.");
            } else {
                next("Error occurred while trying to remove file");
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
            return Repositorie.list(file)
        } catch (error) {
            next(error)
        }
    }

    async update(file){
        try {
            const result = await Repositorie.update(file)

            return result
        } catch (error) {
            return error
        }
    }
}

module.exports = new File