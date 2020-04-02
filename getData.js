// var CronJob = require('cron').CronJob;
// var job = new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');
// job.start();

const { Client } = require('pg')

const client = new Client({
  user: 'osm',
  host: 'localhost',
  database: 'osm',
  password: 'osm',
  port: 5432,
})

client.connect()

// client.query('SELECT vnm_3.gid, count(vehicle.geom) AS totale FROM vnm_3 LEFT JOIN vehicle ON st_contains(vnm_3.geom, vehicle.geom) GROUP BY vnm_3.gid;', (err, res) => {
//   console.log(err, res)
//   client.end()
// })
