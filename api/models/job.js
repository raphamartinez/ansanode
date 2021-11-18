const CronJob = require('cron').CronJob
const Hbs = require('./hbs')
const WebScraping = require('./webscraping')
const Mailpowerbi = require('./mailpowerbi')
const GoalLine = require('./goalline')
const Quiz = require('./quiz')

const jobInterview = new CronJob('0 1 0 * * *', () => {
    try {
        console.log('Executed Quiz!');
        Quiz.finishRobot()
    } catch (error) {
        console.log('Error quiz!' + error);
    }
});

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

const jobReceivable = new CronJob('0 1 4 * * *', () => {
    try {
        console.log('Executed Cron Hbs sucessfuly!');
        Hbs.listReceivables()
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

const jobGoalLine = new CronJob('0 15 5 1 * *', () => {
    try {
        console.log("Executed GoalLine!");

        const date = new Date()

        let year = date.getFullYear()
        let month = date.getMonth() + 12

        if (month > 12) {
            month -= 12
            year += 1
        }

        if (month <= 9) {
            month = `0${month}`
        }

        const now = `${year}-${month}-01`
            
        GoalLine.create(now)
    } catch (error) {
        console.log('Error Mail!' + error);
    }
});




module.exports = { job, jobHbs, jobMail, jobGoalLine, jobReceivable, jobInterview }