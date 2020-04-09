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
  
  await pgClient.query("DROP TABLE IF EXISTS population_mapping_color;").then(() => console.log("Dropped table population_map_color!"))
    .catch(err => console.error('Error executing query', err.stack));
  
  await pgClient.query("DROP TABLE IF EXISTS income_mapping_color;").then(() => console.log("Dropped table income_map_color!"))
    .catch(err => console.error('Error executing query', err.stack));

  await pgClient.query("DROP TABLE IF EXISTS income_info;").then(() => console.log("Dropped table income_info!"))
    .catch(err => console.error('Error executing query', err.stack));

  await pgClient.query("DROP TABLE IF EXISTS population_info;").then(() => console.log("Dropped table population_info!"))
    .catch(err => console.error('Error executing query', err.stack));
  
  await pgClient.end().then(() => console.log('Pool has ended'));
}

// run().catch(err => console.error(err));

module.exports.run = run;