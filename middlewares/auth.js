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

const hasRole = (roles) => {
  return (req, res, next) => {
    const validRole = roles.reduce((prev, cur) => {
      return prev || req.user.getRole() === cur;
    }, false);

    if (validRole) {
      next();
    } else {
      res
        .status(401)
        .send({
          status: 'ERROR',
          message: 'Unauthorized user'
        })
    }
  };
};

module.exports = {
  authenticate,
  hasRole
};