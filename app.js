var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var getIncomeInfo = require('./routes/get/income');
var getPopulationInfo = require('./routes/get/population');
var updateIncome = require('./routes/update/income');
var updatePopulation = require('./routes/update/population');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/map/get/income', getIncomeInfo);
app.use('/map/update/income', updateIncome);
app.use('/map/get/population', getPopulationInfo);
app.use('/map/update/population', updatePopulation);

module.exports = app;
