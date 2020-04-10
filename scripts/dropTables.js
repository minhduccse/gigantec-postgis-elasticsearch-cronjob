const pgClient = require('../db/pgConnection');

// --- DROP TABLE ---
async function run() {
  await pgClient.query("DROP TABLE IF EXISTS vehicle;").then(() => console.log("Dropped table vehicle!"))
    .catch(err => console.error('Error executing query', err.stack));
  
  await pgClient.query("DROP TABLE IF EXISTS district_table;").then(() => console.log("Dropped table district_table!"))
    .catch(err => console.error('Error executing query', err.stack));
  
  await pgClient.query("DROP TABLE IF EXISTS ward_table;").then(() => console.log("Dropped table ward_table!"))
    .catch(err => console.error('Error executing query', err.stack));

  await pgClient.query("DROP TABLE IF EXISTS income_info;").then(() => console.log("Dropped table income_info!"))
    .catch(err => console.error('Error executing query', err.stack));

  await pgClient.query("DROP TABLE IF EXISTS population_info;").then(() => console.log("Dropped table population_info!"))
    .catch(err => console.error('Error executing query', err.stack));
  
  await pgClient.end().then(() => console.log('Pool has ended'));
}

run().catch(err => console.error(err));

module.exports.run = run;