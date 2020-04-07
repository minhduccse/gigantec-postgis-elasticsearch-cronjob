const pgPool = require('../db/pgConnection')

async function createTable() {
    await pgPool.query("CREATE TABLE IF NOT EXISTS public.color_value (id SERIAL PRIMARY KEY, min_value NUMERIC, max_value NUMERIC, color_type VARCHAR (20), color_value VARCHAR (10), color_range_start VARCHAR (10), color_range_stop VARCHAR (10));")
        .then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));
}

async function importSampleData() {
    let promises = [];

    for (let index = 0; index < 5; index++) {
        promises.push(pgPool.query("INSERT INTO color_value (id, min_value, max_value, color_type, color_value) VALUES("
            + index + ", '"
            + index * 30 + "' , '"
            + (index * 30 + 30)
            + "' , 'STATIC', '#ffffff')")
        );
    }

    await Promise.all(promises).then(() => console.log('All done!')).catch(err => console.error('Error executing query', err.stack));

    await pgPool.end().then(() => console.log('Pool-import-wards has ended'));
}

async function run() {
    await createTable();
    await importSampleData();
}

run().catch(err => console.error(err));