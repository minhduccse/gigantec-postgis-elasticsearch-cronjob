var express = require('express');
var router = express.Router();

const pgPool = require('../../db/pgConnection')

router.post('/', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({
            code: 400,
            errorMessage: 'id Is Required',
        });
    } else if (!req.body.color_type) {
        return res.status(400).json({
            code: 400,
            errorMessage: 'color_type Is Required',
        });
    } else if (!req.body.color_value) {
        return res.status(400).json({
            code: 400,
            errorMessage: 'color_value Is Required',
        });
    }

    const { id, color_type, color_value } = req.body;

    pgPool.query("UPDATE income_info SET color_type = $1, color_value = $2 WHERE id = $3", [color_type, color_value, id])
        .then(result => {
            if (result.rowCount > 0) res.json({
                code: 200,
                successObject: "Updated",
            });
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            res.status(500).json({
                code: 500,
                errorMessage: 'Error Executing Query',
                failObject: 'Internal Server Error',
            });
        });
});

module.exports = router;
