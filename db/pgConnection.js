const { Pool, Client } = require('pg');

const pgPool = new Pool({
  user: 'osm',
  host: 'localhost',
  database: 'osm',
  password: 'osm',
  port: 5432,
})

module.exports = pgPool;