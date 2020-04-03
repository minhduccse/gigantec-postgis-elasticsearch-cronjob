var pgClient = require('./pgConnection.js');

pgClient.query("CREATE TABLE IF NOT EXISTS public.map_color (id SERIAL PRIMARY KEY, gid INT, gid_0 VARCHAR (80), gid_1 VARCHAR (80), gid_2 VARCHAR (80), gid_3 VARCHAR (80), color VARCHAR (80));", (err, res) => {
  if (err) console.log(err);
  // console.log(res);
  console.log();
});

pgClient.query("select * from vnm_2 where gid_1 = 'VNM.25_1';", (err, res) => {
  if (res) console.log(res);
  res.rows.forEach(function (row) {
    if (row.gid_3) {
      pgClient.query("INSERT INTO map_color (gid, gid_0, gid_1, gid_2, gid_3, color) VALUES('"
        + row.gid + "', '"
        + row.gid_0 + "', '"
        + row.gid_1 + "', '"
        + row.gid_2 + "', '"
        + row.gid_3
        + "', '#ffffff');",
        (err, res) => {
          if (err) console.log(err);
          // console.log(err, res);
        });
      // console.log(row);
    }
    else {
      pgClient.query("INSERT INTO map_color (gid, gid_0, gid_1, gid_2, gid_3, color) VALUES('"
        + row.gid + "', '"
        + row.gid_0 + "', '"
        + row.gid_1 + "', '"
        + row.gid_2 + "', "
        + null 
        + ", '#ffffff');",
        (err, res) => {
          if (err) console.log(err);
          // console.log(err, res);
        });
      // console.log(row);
    }
  });
});

// pgClient.end();