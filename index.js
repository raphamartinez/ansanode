require('dotenv').config({ path: __dirname + '\\.env', encoding: 'utf8' })
require('events').EventEmitter.prototype._maxListeners = 100;

const customExpress = require('./api/config/customExpress')
const connection = require('./api/infrastructure/database/connection')
const tables = require('./api/infrastructure/database/tables')
const WebScraping = require('./api/models/webscraping')
const express = require('express')
const Hbs = require('./api/models/hbs')
const CronJob = require('cron').CronJob
const path = require('path')
const fs = require('fs')

process.setMaxListeners(100)

const app = customExpress()

app.set('views', [path.join(__dirname, 'views/public'),path.join(__dirname, 'views/admin')])
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.listen(3000, () => {
    console.log('Server Running!!!');
    app.use(express.static(__dirname + '/public'))
    app.use(express.static(__dirname + '/views'))

    app.all('/', function (req, res) {
        res.render('login');
    });

    // app.all('/admin/*', function (req, res) {
    //     const header = fs.createReadStream("index.html");
    //     const footer = fs.createReadStream("footer.html");

    //     req.header = header
    //     req.footer = footer
    // });

    const job = new CronJob('0 01 * * * *', () => {
        try {
            console.log('Executed Cron sucessfuly!');
            WebScraping.init()
        } catch (error) {
            console.log('Error cron!');
        }
    });
    job.start()
})

