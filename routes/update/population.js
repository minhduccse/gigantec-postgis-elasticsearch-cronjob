var express = require('express');
var router = express.Router();

const pgPool = require('../../db/pgConnection')

router.post('/', function (req, res, next) {
    const { gid, population, color_value } = req.body;

    pgPool.query("UPDATE population_info SET population = $1, color_value = $2 WHERE gid = $3;", [population, color_value, gid])
        .then(result => {
            if (result.rowCount > 0) res.json({ successObject: "Updated" });
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            res.status(500).json({ failObject: 'Internal Server Error' });
        });
});

module.exports = router;
