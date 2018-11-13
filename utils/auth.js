const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require('../app.config');

const getRequestAuthToken = (req) => {
  if (!req.headers || !req.headers.authorization) {
    return false;
  }
  const authorization = req.headers.authorization.split(' ');
  if (authorization.length === 2 && authorization[0] === 'Bearer') {
    return authorization[1];
  }
  return false;
};

const jwtSign = obj => jwt.sign(obj, config.jwt.secret, {
  expiresIn: '2h',
});

const jwtDecode = (token) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (e) {
    return Promise.reject();
  }
  return Promise.resolve(decoded);
};

const hashPassword = password => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      reject(err);
    } else {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    }
  });
});

module.exports = {
  getRequestAuthToken,
  jwtSign,
  jwtDecode,
  hashPassword,
};
