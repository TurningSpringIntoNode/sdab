const { User } = require('../core/mongodb').mongoose.models;
const { getRequestAuthToken } = require('../utils/auth');

const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const authenticate = (req, res, next) => {
  const token = getRequestAuthToken(req);
  User
    .findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      return next();
    })
    .catch(() => {
      responseWriter.badResponse(res, 401, constants.UNAUTHORIZED_USER);
    });
};

const hasRole = roles => (req, res, next) => {
  const userRole = req.user.getRole();
  const validRole = roles.reduce((prev, cur) => prev || userRole === cur, false);

  if (validRole) {
    next();
  } else {
    responseWriter.badResponse(res, 401, constants.UNAUTHORIZED_USER);
  }
};

module.exports = {
  authenticate,
  hasRole,
};
