const dropData = require('./cronjob/dropData');
const fetchData = require('./cronjob/fetchData');

var CronJob = require('cron').CronJob;
var job = new CronJob('*/5 * * * *', async function() {
  await dropData.run();
  await fetchData.run();
}, null, true, 'Asia/Ho_Chi_Minh');
job.start();