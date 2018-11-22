const mongoose = require('mongoose');
const config = require('../app.config');

mongoose.Promise = global.Promise;

const mongoURI = process.env.NODE_ENV === 'test' ? `mongodb://127.0.0.1:27017/${process.env.TEST_SUITE}` : config.mongo.uri;

const connection = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

connection.on('error', error => {
  console.log('Failed to connect to db', error)
});

connection.once('open', () => {
  console.log('Connected to db');
});

if (process.env.NODE_ENV === 'test') {
  connection.dropDatabase();
}

exports.mongoose = connection;
