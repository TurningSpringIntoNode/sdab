const { User } = require('../config/mongodb').mongoose.models;
const { getRequestAuthToken } = require('../utils/auth');

const authenticate = (req, res, next) => {
  const token = getRequestAuthToken(req);
  User
    .findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      next();
    })
    .catch(() => {
      res
        .status(401)
        .send({
          status: 'ERROR',
          message: 'Unauthorized user',
        });
    });
};

const hasRole = roles => (req, res, next) => {
  const userRole = req.user.getRole();
  const validRole = roles.reduce((prev, cur) => prev || userRole === cur, false);

  if (validRole) {
    next();
  } else {
    res
      .status(401)
      .send({
        status: 'ERROR',
        message: 'Unauthorized user',
      });
  }
};

module.exports = {
  authenticate,
  hasRole,
};
