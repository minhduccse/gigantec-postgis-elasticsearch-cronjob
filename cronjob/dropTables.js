var pgClient = require('./pgConnection.js');

// --- DROP TABLE ---
pgClient.query("DROP TABLE IF EXISTS vehicle2;", (err, res) => {
  console.log(res, err);
});

pgClient.query("DROP TABLE IF EXISTS map_color;", (err, res) => {
  console.log(res, err);
  pgClient.end();
});