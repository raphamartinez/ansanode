const Repositorie = require('../repositories/file')
const fs = require('fs')

class File {

    async save(file, details, id_login) {
        try {
            const id_file = await Repositorie.insert(file, details, id_login)

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

            const {path} = await Repositorie.view(id_file)
            fs.unlinkSync(path)

            await Repositorie.delete(id_file)

            return true

        } catch (error) {
            if (error && error.code == 'ENOENT') {
                next("File doesn't exist, won't remove it.");
            } else {
                next("Error occurred while trying to remove file");
            }
        }
    }

    async list(file) {
        try {
            if(file.type === "ALL") delete file.type 
            if(file.title === "ALL") delete file.title

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