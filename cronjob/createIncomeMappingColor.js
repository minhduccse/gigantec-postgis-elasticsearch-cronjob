const pgPool = require('../db/pgConnection')

async function createTable() {
    await pgPool.query("CREATE TABLE IF NOT EXISTS public.income_mapping_color (id SERIAL PRIMARY KEY, gid INT, gid_0 VARCHAR (80), gid_1 VARCHAR (80), gid_2 VARCHAR (80), gid_3 VARCHAR (80));").then(() => console.log("Created table!"))
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
        promises.push(pgPool.query("INSERT INTO income_mapping_color (gid, gid_0, gid_1, gid_2, gid_3) VALUES('"
            + row.gid + "', '"
            + row.gid_0 + "', '"
            + row.gid_1 + "', '"
            + row.gid_2 + "', '"
            + row.gid_3
            + "');").then(() => console.log('Import row', row.gid_2)).catch(err => console.error('Error executing query', err.stack)));
    });

    await Promise.all(promises).then(() => console.log('All done!')).catch(err => console.error('Error executing query', err.stack));
    await pgPool.end().then(() => console.log('Pool-import-wards has ended'));
}

async function run() {
    await createTable();
    const wards = await getWards();
    await importData(wards);
}

run();
