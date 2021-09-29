class InvalidArgumentError extends Error {
    constructor (message) {
      super(message)
      this.name = 'InvalidArgumentError'
    }
  }
  
  class InternalServerError extends Error {
    constructor (message) {
      super(message)
      this.name = 'InternalServerError'
    }
  }

  class NotFound extends Error {
    constructor (entity) {
      const message = `No se ha encontrado ${entity}`
      super(message)
      this.name = 'NotFound'
      Object.setPrototypeOf(this, NotFound.prototype);
    }
  }

  class NotAuthorized extends Error {
    constructor () {
      const message = `No se pudo acceder a este recurso`
      super(message)
      this.name = 'NotAuthorized'
    }
  }
  
  
module.exports = { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized }
  