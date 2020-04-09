const { Pool } = require('pg');
var pgPool = null;

async function createTable() {
    pgPool = new Pool({
        user: 'osm',
        host: 'localhost',
        database: 'osm',
        password: 'osm',
        port: 5432,
    });
    await pgPool.query("CREATE TABLE IF NOT EXISTS public.population_mapping_color (id SERIAL PRIMARY KEY, gid INT, gid_0 VARCHAR (80), gid_1 VARCHAR (80), gid_2 VARCHAR (80), name_2 VARCHAR (80), geom geometry(MULTIPOLYGON));").then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));
}

async function getDistricts() {
    let districts = [];
    await pgPool.query("select * from vnm_2 where gid_1 = 'VNM.25_1';").then(res => {
        districts = res.rows;
    }).catch(err => console.error('Error executing query', err.stack));
    return districts;
}

async function importData(districts) {
    var promises = [];

    districts.map(function (row) {
        promises.push(pgPool.query("INSERT INTO population_mapping_color (gid, gid_0, gid_1, gid_2, name_2, geom) VALUES('"
            + row.gid + "', '"
            + row.gid_0 + "', '"
            + row.gid_1 + "', '"
            + row.gid_2 + "', '"
            + row.name_2 + "', ST_AsText('"
            + row.geom
            + "'));").then(() => console.log('Import row', row.gid_2))
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
