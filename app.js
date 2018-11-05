if(process.env.NODE_ENV == 'production')
  require('dotenv').config();

const express = require('express');
const compression = require('compression');
const logger = require('morgan');

require('./config/passport-setup');
if(process.env.NODE_ENV == 'production')
  require('./config/mongodb').connect();
require('./models/index');

require('./config/admin-setup');

const app = express();

app.use(compression());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('./core/routes')(app);

module.exports = app;