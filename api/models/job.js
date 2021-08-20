const CronJob = require('cron').CronJob
const Hbs = require('./hbs')
const WebScraping = require('./webscraping')
const Mailpowerbi = require('./mailpowerbi')

const job = new CronJob('0 15 * * * *', () => {
    try {
        console.log('Executed Cron sucessfuly!');
        WebScraping.init()
    } catch (error) {
        console.log('Error cron!' + error);
    }
});

const jobHbs = new CronJob('0 30 5 * * *', () => {
    try {
        console.log('Executed Cron Hbs sucessfuly!');
        Hbs.init()
    } catch (error) {
        console.log('Error cron!' + error);
    }
});

const jobMail = new CronJob('0 1 * * * *', () => {
    try {
        console.log("Executed Mail!");
        Mailpowerbi.listMailtoSend()
    } catch (error) {
        console.log('Error Mail!' + error);
    }
});

const jobGoalLine = new CronJob('0 0 5 1 * *', () => {
    try {
        console.log("Executed Mail!");
        Mailpowerbi.listMailtoSend()
    } catch (error) {
        console.log('Error Mail!' + error);
    }
});




module.exports = { job, jobHbs, jobMail, jobGoalLine }