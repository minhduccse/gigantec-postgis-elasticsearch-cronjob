const pgPool = require('../db/pgConnection')

async function createTable() {
    await pgPool.query("CREATE TABLE IF NOT EXISTS public.population_mapping_color (id SERIAL PRIMARY KEY, gid INT, gid_0 VARCHAR (80), gid_1 VARCHAR (80), gid_2 VARCHAR (80), color VARCHAR (80));").then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));
}

async function getDistricts() {
    let districts = [];
    await pgPool.query("select * from vnm_2 where gid_1 = 'VNM.25_1';").then(res => {
        districts = res.rows;
    }).catch(err => console.error('Error executing query', err.stack));
    return districts;
}

async function importData(districs) {
    var promises = [];

    districs.map(function (row) {
        promises.push(pgPool.query("INSERT INTO population_mapping_color (gid, gid_0, gid_1, gid_2, color) VALUES('"
            + row.gid + "', '"
            + row.gid_0 + "', '"
            + row.gid_1 + "', '"
            + row.gid_2
            + "', '#ffffff');").then(() => console.log('Import row', row.gid_2)).catch(err => console.error('Error executing query', err.stack)));
    });

    await Promise.all(promises).then(() => console.log('All done!')).catch(err => console.error('Error executing query', err.stack));
    await pgPool.end().then(() => console.log('Pool-import-districts has ended'));
}

async function run() {
    await createTable();
    const districts = await getDistricts();
    await importData(districts);
}

run();
