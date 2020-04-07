var express = require('express');
var _ = require('lodash');
var router = express.Router();
const pgPool = require('../../db/pgConnection');
var date = new Date();

/* GET mapping color listing. */
router.get('/', function (req, res, next) {
  pgPool.query("SELECT * FROM public.income_info").then(result => res.status(200).json({
    timestamp: date.getTime(),
    code: 200,
    successObject: _.orderBy(result.rows, ['id']),
  }))
  .catch(err => {
    console.error('Error executing query', err.stack);
    res.status(500).json({
      timestamp: date.getTime(),
      code: 500,
      failObject: 'Internal Server Error',
    });
  });;
});

module.exports = router;
