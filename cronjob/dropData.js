const { Pool, Client } = require('pg');

// --- DROP TABLE ---
async function run() {
  const pgClient = new Pool({
    user: 'osm',
    host: 'localhost',
    database: 'osm',
    password: 'osm',
    port: 5432,
  })

  await pgClient.query("DROP TABLE IF EXISTS vehicle;").then(() => console.log("Dropped table vehicle!"))
    .catch(err => console.error('Error executing query', err.stack));
  
  await pgClient.end().then(() => console.log('Pool has ended'));
}

module.exports.run = run;