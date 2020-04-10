const pgPool = require('../db/pgConnection');

async function createTable() {
    await pgPool.query("CREATE TABLE IF NOT EXISTS public.income_info (id SERIAL PRIMARY KEY, max_value NUMERIC, color_type VARCHAR (20), color_value VARCHAR (10), color_range_start VARCHAR (10), color_range_stop VARCHAR (10));")
        .then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));

    await pgPool.query("CREATE TABLE IF NOT EXISTS public.population_info (gid SERIAL PRIMARY KEY, district VARCHAR (30), population INT, color_value VARCHAR (10));")
        .then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));
}

async function importIncomeSampleData() {
    let promises = [];

    for (let index = 0; index < 6; index++) {
        promises.push(pgPool.query("INSERT INTO income_info (id, max_value, color_type, color_value) VALUES("
            + index + ", '"
            + (index + 1) * 25
            + "' , 'STATIC', '#ffffff')")
        );
    }

    await Promise.all(promises)
        .then(() => console.log('All done!'))
        .catch(err => console.error('Error executing query', err.stack));
}

async function getDistricts() {
    let districts = [];
    await pgPool.query("select * from district_table;").then(res => {
        districts = res.rows;
    }).catch(err => console.error('Error executing query', err.stack));
    return districts;
}

async function importPopulationSampleData(districts) {
    var promises = [];

    districts.map(function (row) {
        promises.push(pgPool.query("INSERT INTO population_info (gid, district, population, color_value) VALUES("
            + row.gid + ", '"
            + row.district + "', "
            + 0 + ", '#ffffff');")
            .then(() => console.log('Import district ', row.district))
            .catch(err => console.error('Error executing query', err.stack)));
    });

    await Promise.all(promises).then(() => console.log('All done!'))
        .catch(err => console.error('Error executing query', err.stack));
    await pgPool.end().then(() => console.log('Pool has ended'));
}

async function run() {
    await createTable();
    await importIncomeSampleData();
    const districts = await getDistricts();
    await importPopulationSampleData(districts);
}

run().catch(err => console.error(err));

module.exports.run = run;