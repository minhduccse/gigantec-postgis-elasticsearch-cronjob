var express = require('express');
var router = express.Router();
const pgPool = require('../db/pgConnection')

/* GET mapping color listing. */
router.get('/', function (req, res, next) {
  pgPool.query("SELECT * FROM public.color_value").then(result => res.json(result.rows)).catch(err => {
    console.error('Error executing query', err.stack);
    res.status(500).json({ failObject: 'Internal Server Error' });
  });;
});

module.exports = router;
