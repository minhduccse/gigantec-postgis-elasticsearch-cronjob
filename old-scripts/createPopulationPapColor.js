var pgClient = require('./pgConnection.js');

pgClient.query("CREATE TABLE IF NOT EXISTS public.population_map_color (id SERIAL PRIMARY KEY, gid INT, gid_0 VARCHAR (80), gid_1 VARCHAR (80), gid_2 VARCHAR (80), gid_3 VARCHAR (80), color VARCHAR (80));", (err, res) => {
    if (err) console.log(err);
    console.log();
});

const promiseQueryImport = new Promise((resolve, reject) => {
    return pgClient.query("select * from vnm_2 where gid_1 = 'VNM.25_1';", (err, res) => {
        if (res) resolve(res);
        else if (err) reject(err);
    });
});

async function getDistricts() {
    let districts = [];
    await promiseQueryImport.then(res => districts = res.rows).catch(e => console.error(e));
    districts.forEach(row => console.log(row.gid_2));
    return districts;
    
}

var districts = getDistricts();
console.log(districts);

// pgClient.end();