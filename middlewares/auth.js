const User = require('../models/user.model');
const { getRequestAuthToken } = require('../utils/auth');
const authenticate = (req, res, next) => {
  const token = getRequestAuthToken(req);
  User
    .findByToken(token)
    .then(user => {
      req.user = user;
      next();
    });
};

module.exports = {
  authenticate
};