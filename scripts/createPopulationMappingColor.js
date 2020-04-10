const pgPool = require('../db/pgConnection');

async function createTable() {
    await pgPool.query("CREATE TABLE IF NOT EXISTS public.district_table (gid SERIAL PRIMARY KEY, nation VARCHAR (80), province VARCHAR (80), district VARCHAR (80), geom geometry(MULTIPOLYGON));").then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));
}

async function getDistricts() {
    let districts = [];
    await pgPool.query("select * from vnm_2 where province = 'Hồ Chí Minh';").then(res => {
        districts = res.rows;
    }).catch(err => console.error('Error executing query', err.stack));
    return districts;
}

async function importData(districts) {
    var promises = [];

    districts.map(function (row) {
        promises.push(pgPool.query("INSERT INTO district_table (gid, nation, province, district, geom) VALUES('"
            + row.gid + "', '"
            + row.nation + "', '"
            + row.province + "', '"
            + row.district + "', ST_AsText('"
            + row.geom
            + "'));").then(() => console.log('Import row', row.district))
            .catch(err => console.error('Error executing query', err.stack)));
    });

    await Promise.all(promises)
        .then(() => console.log('All done!'))
        .catch(err => console.error('Error executing query', err.stack));
    await pgPool.end().then(() => console.log('Pool has ended'));
}

async function run() {
    await createTable();
    const districts = await getDistricts();
    await importData(districts);
}

run().catch(err => console.error(err));

module.exports.run = run;
