const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const express = require('express');
const compression = require('compression');
const logger = require('morgan');

require('./core/passport-setup');

const mongoose = require('mongoose');
const connection = require('./core/mongodb').mongoose;
require('./models')(connection, mongoose);

require('./core/admin-setup')();

const app = express();

app.use(compression());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('./core/routes')(app);

module.exports = app;
