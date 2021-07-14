const fs = require('fs')
const path = require('path')

class File {
    
    read(pathFile, fileName, callbackImage){
        const validType = ['jpg', 'png', 'jpeg','xlsx','pdf']
        const type = path.extname(pathFile)
        const typeIsValid = validType.indexOf(type.substring(1)) !== -1
    
        if(typeIsValid){
            const error = 'Type is not valid'
            callbackImage(error)
        } else {
            const newPathFile = `../${fileName}${type}`
    
            fs.createReadStream(pathFile)
              .pipe(fs.createWriteStream(newPathFile))
              .on('finish', () => callbackImage(false, pathFile))
        }
    }
}

module.exports = new File