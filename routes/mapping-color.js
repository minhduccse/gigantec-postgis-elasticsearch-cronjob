var express = require('express');
var router = express.Router();

/* GET mapping color listing. */
router.get('/', function(req, res, next) {
  res.json({successObject: 'Response success'});
});

module.exports = router;
