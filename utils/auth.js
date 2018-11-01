const jwt = require('jsonwebtoken');
const config = require('../app.config');

const getRequestAuthToken = req => {
  if (!req.headers || !req.headers.authorization) {
    return false;
  }
  const authorization = req.headers.authorization.split(' ');
  if (authorization.length == 2 && authorization[0] == 'Bearer') {
    return authorization[1];
  }
  return false;
};

const jwtSign = obj => {
  return jwt.sign(obj, config.jwt.secret, {
    expiresIn: '2h'
  });
};

const jwtDecode = token => {
  let decoded = null;
  try {
    decoded = jwt.verify(token)
  } catch (e) {
    return Promise.reject();
  }
  return decoded;
};

module.exports = {
  getRequestAuthToken,
  jwtSign,
  jwtDecode
};