var CronJob = require('cron').CronJob;
const ctrlUser = require('./users');
// function start() {
//     console.log("started");
//     //docWorkers.processDelayedSessionMessagesForFreelancers(io);
//     idleCheckCron = new cronJob({
//         cronTime: '*/60 * * * * *',  // Once every hour
//         onTick: ctrlUser.check_visit(),
//         start: true,
//         runOnInit: false,
//         timeZone: 'Asia/Kolkata',
//     });
//     idleCheckCron.start();
//     console.log("runs");
// }
// module.exports = {
//     start,
// };

new CronJob('*/60 * * * * *', function() {
    
    // Execute code here
    ctrlUser.check_visit();

}, null, true, 'America/Los_Angeles');