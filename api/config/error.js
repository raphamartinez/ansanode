const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const { InvalidArgumentError, NotFound, NotAuthorized } = require('../models/error');

module.exports = () => {

app.use((err, req, res, next) => {

    let status = 500
    const body = {
      message: 'Hubo un problema al realizar la operación. Intenta más tarde'
    }
  
    if (err instanceof NotFound) {
      status = 404
      body.dateExp = err.dateExp
    }
  
    if (err instanceof NotAuthorized) {
      status = 401
      body.dateExp = err.dateExp
    }
  
    if (err instanceof InvalidArgumentError) {
      status = 400
    }
  
    if (err instanceof jwt.JsonWebTokenError) {
      status = 401
    }
  
    if (err instanceof jwt.TokenExpiredError) {
      status = 401
      body.dateExp = err.dateExp
    }
  
  
    res.status(status)
    res.json(body)
  
  })
}