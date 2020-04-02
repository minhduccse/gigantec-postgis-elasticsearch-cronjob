var pgClient = require('./pgConnection.js');

pgClient.query("CREATE TABLE IF NOT EXISTS public.color_map (gid SERIAL PRIMARY KEY, latitude NUMERIC, longitude NUMERIC, time timestamp WITHOUT time zone, geom geometry(POINT,4326));", (err, res) => {
    if (err) console.log(err);
    // console.log(res);
    console.log();
});

// pgClient.query("CREATE TABLE IF NOT EXISTS public.color_map (gid SERIAL PRIMARY KEY, latitude NUMERIC, longitude NUMERIC, time timestamp WITHOUT time zone, geom geometry(POINT,4326));", (err, res) => {
// if(err) console.log(err);
// // console.log(res);
// console.log();
// });

pgClient.query("select * from vnm_3 where gid_1 = 'VNM.25_1' limit 10;", (err, res) => {
  if(res) console.log(res);
  res.rows.forEach(function (hit) {
    pgClient.query("INSERT INTO map_color (latitude, longitude, time, geom) VALUES("
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
  pgClient.end();
})