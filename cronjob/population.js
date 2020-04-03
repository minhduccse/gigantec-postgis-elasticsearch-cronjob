const pgDb = require('../db/pgConnection')

async function getDistricts() {
    pgDb.query("CREATE TABLE IF NOT EXISTS public.population_map_color (id SERIAL PRIMARY KEY, gid INT, gid_0 VARCHAR (80), gid_1 VARCHAR (80), gid_2 VARCHAR (80), gid_3 VARCHAR (80), color VARCHAR (80));").then(() => console.log("Created table!"))
        .catch(err => console.error('Error executing query', err.stack));

    let districts = [];
    pgDb.query("select * from vnm_2 where gid_1 = 'VNM.25_1';").then(res => { 
        districts = { ...res.rows };
    }).catch(err => console.error('Error executing query', err.stack));

    pgDb.end().then(() => console.log('pool has ended'));
}

getDistricts();