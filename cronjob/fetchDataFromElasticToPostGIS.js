var esClient = require('../db/esConnection.js');
var pgPool = require('../db/pgConnection.js');



async function createTable() {
  // --- CREATE TABLE IF NOT EXISTS ---
  await pgPool.query("CREATE TABLE IF NOT EXISTS public.vehicle (gid SERIAL PRIMARY KEY, latitude NUMERIC, longitude NUMERIC, time timestamp WITHOUT time zone, geom geometry(POINT,4326));")
    .then(() => console.log("Created table!"))
    .catch(err => console.error('Error executing query', err.stack));
}

async function getPoints() {
  let points = [];
  const response = await esClient.search({
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
      console.log("Search error: " + error);
    }
    else {
      // console.log("--- Response ---");
      // console.log(response);
      // console.log("--- Hits ---");
      response.hits.hits.forEach(function (hit) {
        points.push(hit);
      });

      if (response.hits.total !== points.length) {
        esClient.scroll({
          scrollId: response._scroll_id,
          scroll: '10s'
        }, getMoreUntilDone);
      } else {
        console.log('All done!');
      }
    }
  });
  console.log(points);
  return points;
}

async function importData(points) {
  var promises = [];
  points.map(function (point) {
      promises.push(pgClient.query("INSERT INTO vehicle (latitude, longitude, time, geom) VALUES("
      + point._source.latitude + ", "
      + point._source.longitude + ", "
      + "(to_timestamp('"
      + point._source.time
      + "', 'yyyy-mm-dd hh24:mi:ss')), "
      + "ST_GeomFromText('POINT("
      + point._source.latitude + " "
      + point._source.longitude
      + ")', 4326));")
      .catch(err => console.error('Error executing query', err.stack)));
  });

  await Promise.all(promises)
  .then(() => console.log('All done!'))
  .catch(err => console.error('Error executing query', err.stack));

  await pgPool.end().then(() => console.log('Pool-import-points has ended'));
}


async function run() {
  await createTable();
  const points = await getPoints();
  await importData(points);
}

run().catch(err => console.error(err));