const redis = require('redis');
const handlerList = require('./handlerlist');
const cachelist = redis.createClient({ prefix: 'cache:' });

module.exports = handlerList(cachelist);