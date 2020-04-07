const pgPool = require('../db/pgConnection')

async function createTable() {
    await pgPool.query("CREATE TABLE IF NOT EXISTS public.income_mapping_color (id SERIAL PRIMARY KEY, gid INT, gid_0 VARCHAR (80), gid_1 VARCHAR (80), gid_2 VARCHAR (80), gid_3 VARCHAR (80), geom geometry(MULTIPOLYGON));")
        .then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));
}

async function getWards() {
    let wards = [];
    await pgPool.query("select * from vnm_3 where gid_1 = 'VNM.25_1';").then(res => {
        wards = res.rows;
    }).catch(err => console.error('Error executing query', err.stack));
    return wards;
}

async function importData(wards) {
    var promises = [];

    wards.map(function (row) {
        promises.push(pgPool.query("INSERT INTO income_mapping_color (gid, gid_0, gid_1, gid_2, gid_3, geom) VALUES('"
            + row.gid + "', '"
            + row.gid_0 + "', '"
            + row.gid_1 + "', '"
            + row.gid_2 + "', '"
            + row.gid_3 + "', ST_AsText('"
            + row.geom
            + "'));").then(() => console.log('Import row', row.gid_2)).catch(err => console.error('Error executing query', err.stack)));
    });

    await Promise.all(promises).then(() => console.log('All done!')).catch(err => console.error('Error executing query', err.stack));
}

async function calculateDensity() {
    await pgPool.query("ALTER TABLE income_mapping_color ADD COLUMN IF NOT EXISTS numpoint NUMERIC; ALTER TABLE income_mapping_color ADD COLUMN IF NOT EXISTS total_weight NUMERIC; UPDATE income_mapping_color SET numpoint = sub_table.numpoint, total_weight = sub_table.total_weight FROM (SELECT vnm_3.gid, COUNT(heat_data.geom) AS numpoint, COALESCE(SUM(heat_data.weight),0) AS total_weight FROM vnm_3 LEFT JOIN heat_data ON st_contains(vnm_3.geom heat_data.geom) GROUP BY vnm_3.gid) AS sub_table WHERE sub_table.gid = income_mapping_color.gid;")
        .then(() => console.log("Calculated numpoint and total weight!"))
        .catch(err => console.error('Error executing query', err.stack));

    await pgPool.query("ALTER TABLE income_mapping_color ADD COLUMN IF NOT EXISTS mean NUMERIC; UPDATE income_mapping_color SET mean = (CASE income_mapping_color.numpoint WHEN 0 THEN 0 ELSE total_weight / numpoint END);")
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

run();
