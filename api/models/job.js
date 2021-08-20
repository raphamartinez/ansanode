const CronJob = require('cron').CronJob
const Hbs = require('./hbs')
const WebScraping = require('./webscraping')
const Mailpowerbi = require('./mailpowerbi')

class Job {

    execute() {
        const job = new CronJob('0 15 * * * *', () => {
            try {
                console.log('Executed Cron sucessfuly!');
                WebScraping.init()
            } catch (error) {
                console.log('Error cron!' + error);
            }
        });

        job.start()

        const jobHbs = new CronJob('0 30 5 * * *', () => {
            try {
                console.log('Executed Cron Hbs sucessfuly!');
                Hbs.init()
            } catch (error) {
                console.log('Error cron!' + error);
            }
        });

        jobHbs.start()

        const jobMail = new CronJob('0 0 * * * *', () => {
            try {
                console.log("Executed Mail!");
                Mailpowerbi.listMailtoSend()
            } catch (error) {
                console.log('Error Mail!' + error);
            }
        });

        jobMail.start()

        const jobGoalLine = new CronJob('0 0 5 1 * *', () => {
            try {
                console.log("Executed Mail!");
                Mailpowerbi.listMailtoSend()
            } catch (error) {
                console.log('Error Mail!' + error);
            }
        });

        jobGoalLine.start()
    }
}

module.exports = new Job