var esClient = require('../db/esConnection.js');
var pgPool = require('../db/pgConnection.js');



async function createTable() {
  // --- CREATE TABLE IF NOT EXISTS ---
  await pgPool.query("CREATE TABLE IF NOT EXISTS public.vehicle (gid SERIAL PRIMARY KEY, latitude NUMERIC, longitude NUMERIC, time timestamp WITHOUT time zone, geom geometry(POINT,4326));")
    .then(() => console.log("Created table!"))
    .catch(err => console.error('Error executing query', err.stack));
}

async function getPoints() {
  let allPoints = [];
  let responseQueue = [];
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
  });

  responseQueue.push(response);

  while (responseQueue.length) {
    const body = responseQueue.shift()
    // collect the points from this response
    body.hits.hits.forEach(function (hit) {
      allPoints.push(hit);
    })

    // check to see if we have collected all of the points
    if (body.hits.total.value === allPoints.length) {
      console.log('All points!');
      break;
    }

    // get the next response if there are more points to fetch
    responseQueue.push(
      await esClient.scroll({
        scrollId: body._scroll_id,
        scroll: '30s'
      })
    )
  }
  return allPoints;
}

async function importData(points) {
  var promises = [];
  points.map(function (point) {
    promises.push(pgPool.query("INSERT INTO vehicle (latitude, longitude, time, geom) VALUES("
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