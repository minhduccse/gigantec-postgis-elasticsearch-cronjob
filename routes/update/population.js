var express = require('express');
var router = express.Router();
var date = new Date();

const pgPool = require('../../db/pgConnection')

router.post('/', function (req, res, next) {
    if (!req.body.gid) {
        return res.status(400).json({
            timestamp: date.getTime(),
            code: 400,
            errorMessage: 'gid Is Required',
        });
    } else if (!req.body.population) {
        return res.status(400).json({
            timestamp: date.getTime(),
            code: 400,
            errorMessage: 'population Is Required',
        });
    } else if (!req.body.color_value) {
        return res.status(400).json({
            timestamp: date.getTime(),
            code: 400,
            errorMessage: 'color_value Is Required',
        });
    }
    const { gid, population, color_value } = req.body;

    pgPool.query("UPDATE population_info SET population = $1, color_value = $2 WHERE gid = $3;", [population, color_value, gid])
        .then(result => {
            if (result.rowCount > 0) res.json({
                timestamp: date.getTime(),
                code: 200,
                successObject: "Updated",
            });
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            res.status(500).json({
                timestamp: date.getTime(),
                code: 500,
                errorMessage: 'Error Executing Query',
                failObject: 'Internal Server Error',
            });
        });
});

module.exports = router;
