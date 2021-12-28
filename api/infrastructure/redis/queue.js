const Queue = require('bull');

const Jobs = require('../../jobs');

const queues = Object.values(Jobs).map(job => ({
    bull: new Queue(job.key, { host: 'localhost', port: process.env.REDIS_PORT }),
    name: job.key,
    handle: job.handle,
    options: job.options
}))

module.exports = {
    queues,
    add(name, data) {
        const queue = queues.find(queue => queue.name === name);

        return queue.bull.add(data, queue.options);
    },
    process() {
        return this.queues.forEach(queue => {
            queue.bull.process(queue.handle);

            queue.bull.on('failed', (job, err) => {
                console.log('job failed', queue.key, job.data);
                console.log(err);
            })
        })
    }
};
