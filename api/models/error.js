class InvalidArgumentError extends Error {
    constructor (msg) {
      super(msg)
      this.name = 'InvalidArgumentError'
    }
  }
  
  class InternalServerError extends Error {
    constructor (msg) {
      super(msg)
      this.name = 'InternalServerError'
    }
  }

  class NotFound extends Error {
    constructor (entity) {
      const msg = `No se ha encontrado ${entity}`
      super(msg)
      this.name = 'NotFound'
      Object.setPrototypeOf(this, NotFound.prototype);
    }
  }

  class NotAuthorized extends Error {
    constructor () {
      const msg = `No se pudo acceder a este recurso`
      super(msg)
      this.name = 'NotAuthorized'
    }
  }
  
  
module.exports = { InvalidArgumentError, InternalServerError, NotFound, NotAuthorized }
  