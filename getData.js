var esClient = require('./esConnection.js');
var pgClient = require('./pgConnection.js');

// --- CREATE TABLE IF NOT EXISTS ---
pgClient.query("CREATE TABLE IF NOT EXISTS public.vehicle2 (gid SERIAL PRIMARY KEY, latitude NUMERIC, longitude NUMERIC, time timestamp WITHOUT time zone, geom geometry(POINT,4326));", (err, res) => {
  console.log(res);
  console.log();
})

esClient.search({
  index: 'vehicle',
  scroll: '10s',
  body: {
    query: {
      range: {
        time: {
          time_zone: "+07:00",
          gte: "now-1d",
          lte: "now"
        }
      }
    }
  }
}, function getMoreUntilDone(error, response, status) {
  if (error) {
    console.log("Search error: " + error)
  }
  else {
    // console.log("--- Response ---");
    // console.log(response);
    // console.log("--- Hits ---");
    response.hits.hits.forEach(function (hit) {
      pgClient.query("INSERT INTO vehicle2 (latitude, longitude, time, geom) VALUES("
        + hit._source.latitude + ", "
        + hit._source.longitude + ", "
        + "(to_timestamp('"
        + hit._source.time
        + "', 'yyyy-mm-dd hh24:mi:ss')), "
        + "ST_GeomFromText('POINT("
        + hit._source.latitude + " "
        + hit._source.longitude
        + ")', 4326));", (err, res) => {
          if(err) console.log(err);
          // console.log(err, res);
        });
      // console.log(hit);
    });

    if (response.hits.total !== allRecords.length) {
      esClient.scroll({
        scrollId: response._scroll_id,
        scroll: '10s'
      }, getMoreUntilDone);
    } else {
      console.log('All done!');
    }
  }
});



// pgClient.query('SELECT vnm_3.gid, count(vehicle.geom) AS totale FROM vnm_3 LEFT JOIN vehicle ON st_contains(vnm_3.geom, vehicle.geom) GROUP BY vnm_3.gid;', (err, res) => {
//   console.log(err, res)
//   pgClient.end()
// })
// pgClient.query("SELECT EXISTS (SELECT FROM pg_tables  WHERE  schemaname = 'public' AND tablename  = 'vehicle2');", (err, res) => {
//   console.log(res)
//   pgClient.end()
// })


// --- DROP TABLE ---
// pgClient.query("DROP TABLE IF EXISTS vehicle2;", (err, res) => {
//   console.log(res)
//   pgClient.end()
// })





  // var CronJob = require('cron').CronJob;
  // var job = new CronJob('* * * * * *', function() {
  //   console.log('You will see this message every second');
  // }, null, true, 'America/Los_Angeles');
  // job.start();


