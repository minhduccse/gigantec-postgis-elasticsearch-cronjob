const elasticsearch = require('elasticsearch');
const { Pool } = require('pg');

var pgPool = null;

async function createTable() {
  pgPool = new Pool({
    user: 'osm',
    host: 'localhost',
    database: 'osm',
    password: 'osm',
    port: 5432,
  })
  // --- CREATE TABLE IF NOT EXISTS ---
  await pgPool.query("CREATE TABLE IF NOT EXISTS public.vehicle (gid SERIAL PRIMARY KEY, geom geometry(POINT,4326));")
    .then(() => console.log("Created table!"))
    .catch(err => console.error('Error executing query', err.stack));
}

async function getPoints() {
  const esClient = new elasticsearch.Client( {  
    hosts: [
      'http://localhost:9200/',
    ]
  });

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
      console.log('All points collected!');
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
    promises.push(pgPool.query("INSERT INTO vehicle (geom) VALUES("
      + "ST_GeomFromText('POINT("
      + point._source.longitude + " "
      + point._source.latitude
      + ")', 4326));")
      .catch(err => console.error('Error executing query', err.stack)));
  });

  await Promise.all(promises)
    .then(() => console.log('All done!'))
    .catch(err => console.error('Error executing query', err.stack));
}

async function reindex() {
  await pgPool.query("REINDEX TABLE vehicle")
    .then(() => console.log("Reindexed table!"))
    .catch(err => console.error('Error executing query', err.stack));
  await pgPool.end().then(() => console.log('Pool-fetch-data has ended'));
}

async function run() {
  await createTable();
  const points = await getPoints();
  await importData(points);
  await reindex();
}

module.exports.run = run;
