const dropTables = require('./cronjob/dropTables');
const fetchDataFromElasticToPostGIS = require('./cronjob/fetchDataFromElasticToPostGIS');
const createIncomeMappingColor = require('./cronjob/createIncomeMappingColor');
const createPopulationMappingColor = require('./cronjob/createPopulationMappingColor');
const createHashColorTable = require('./cronjob/createHashColorTable');

var CronJob = require('cron').CronJob;
var job = new CronJob('*/5 * * * *', async function() {
  await dropTables.run();
  await fetchDataFromElasticToPostGIS.run();
  await createIncomeMappingColor.run();
  await createPopulationMappingColor.run();
  await createHashColorTable.run();
}, null, true, 'America/Los_Angeles');
job.start();