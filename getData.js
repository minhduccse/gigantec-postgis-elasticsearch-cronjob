// var CronJob = require('cron').CronJob;
// var job = new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');
// job.start();




var esClient = require('./esConnection.js');
var pgClient = require('./pgConnection.js');

esClient.cluster.health({},function(err,resp,status) {  
  console.log("-- Client Health --",resp);
});


pgClient.query('SELECT vnm_3.gid, count(vehicle.geom) AS totale FROM vnm_3 LEFT JOIN vehicle ON st_contains(vnm_3.geom, vehicle.geom) GROUP BY vnm_3.gid;', (err, res) => {
  console.log(err, res)
  pgClient.end()
})