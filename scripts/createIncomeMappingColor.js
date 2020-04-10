const pgPool = require('../db/pgConnection');

async function createTable() {
    await pgPool.query("CREATE TABLE IF NOT EXISTS public.ward_table (gid SERIAL PRIMARY KEY, nation VARCHAR (80), province VARCHAR (80), district VARCHAR (80), ward VARCHAR (80), geom geometry(MULTIPOLYGON));")
        .then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));
}

async function getWards() {
    let wards = [];
    await pgPool.query("select * from vnm_3 where province = 'Hồ Chí Minh';").then(res => {
        wards = res.rows;
    }).catch(err => console.error('Error executing query', err.stack));
    return wards;
}

async function importData(wards) {
    var promises = [];

    wards.map(function (row) {
        promises.push(pgPool.query("INSERT INTO ward_table (gid, nation, province, district, ward, geom) VALUES('"
            + row.gid + "', '"
            + row.nation + "', '"
            + row.province + "', '"
            + row.district + "', '"
            + row.ward + "', ST_AsText('"
            + row.geom
            + "'));").then(() => console.log('Import row', row.ward))
            .catch(err => console.error('Error executing query', err.stack)));
    });

    await Promise.all(promises)
        .then(() => console.log('All done!'))
        .catch(err => console.error('Error executing query', err.stack));
}

async function calculateDensity() {
    await pgPool.query("ALTER TABLE ward_table ADD COLUMN IF NOT EXISTS numpoint NUMERIC; ALTER TABLE ward_table ADD COLUMN IF NOT EXISTS total_weight NUMERIC; UPDATE ward_table SET numpoint = sub_table.numpoint, total_weight = sub_table.total_weight FROM (SELECT vnm_3.gid, COUNT(heat_data.geom) AS numpoint, COALESCE(SUM(CAST(heat_data.weight AS NUMERIC)),0) AS total_weight FROM vnm_3 LEFT JOIN heat_data ON st_contains(vnm_3.geom, heat_data.geom) GROUP BY vnm_3.gid) AS sub_table WHERE sub_table.gid = ward_table.gid;")
        .then(() => console.log("Calculated numpoint and total weight!"))
        .catch(err => console.error('Error executing query', err.stack));

    await pgPool.query("ALTER TABLE ward_table ADD COLUMN IF NOT EXISTS mean NUMERIC; UPDATE ward_table SET mean = (CASE ward_table.numpoint WHEN 0 THEN 0 ELSE total_weight / numpoint END);")
        .then(() => console.log("Calculated density!"))
        .catch(err => console.error('Error executing query', err.stack));

    await pgPool.end().then(() => console.log('Pool has ended'));
}

async function run() {
    await createTable();
    const wards = await getWards();
    await importData(wards);
    await calculateDensity();
}

run().catch(err => console.error(err));

module.exports.run = run;
