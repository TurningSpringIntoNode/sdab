const mongoose = require('mongoose');
const config = require('../app.config');

mongoose.Promise = global.Promise;

const mongoURI = process.env.NODE_ENV === 'test' ? `mongodb://127.0.0.1:27017/${process.env.TEST_SUITE}` : config.mongo.uri;

const connection = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

if (process.env.NODE_ENV === 'test') {
  connection.dropDatabase();
}

exports.mongoose = connection;
