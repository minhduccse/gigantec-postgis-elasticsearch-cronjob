var express = require('express');
var router = express.Router();

const pgPool = require('../../db/pgConnection')

router.post('/', function (req, res, next) {
    pgPool.query("UPDATE population_info SET population = '"
        + req.body.population + "', color_value = '"
        + req.body.color_value + "' WHERE gid = "
        + req.body.gid + "; ")
        .then(result => {
            if (result.rowCount > 0) res.json({ successObject: "Updated" });
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            res.status(500).json({ failObject: 'Internal Server Error' });
        });
});

module.exports = router;
