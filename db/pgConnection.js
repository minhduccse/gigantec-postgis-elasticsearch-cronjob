const { Client } = require('pg')

const pgClient = new Client({
  user: 'osm',
  host: 'localhost',
  database: 'osm',
  password: 'osm',
  port: 5432,
})

pgClient.connect()
module.exports = pgClient;  