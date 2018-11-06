const User = require('../config/mongodb').mongoose.models.User;
const { getRequestAuthToken } = require('../utils/auth');
const authenticate = (req, res, next) => {
  const token = getRequestAuthToken(req);
  User
    .findByToken(token)
    .then(user => {
      if (!user) {
        res
          .status(401)
          .send({
            status: 'ERROR',
            message: 'Unauthorized user'
          });
      } else {
        req.user = user;
        next();
      }
    })
    .catch(() => {
      res
        .status(401)
        .send({
          status: 'ERROR',
          message: 'Unauthorized user'
        });
    });
};

const hasRole = (roles) => {

  return (req, res, next) => {
    const userRole = req.user.getRole();
    const validRole = roles.reduce((prev, cur) => {
      return prev || userRole === cur;
    }, false);

    if (validRole) {
      next();
    } else {
      res
        .status(401)
        .send({
          status: 'ERROR',
          message: 'Unauthorized user'
        });
    }
  };
};

module.exports = {
  authenticate,
  hasRole
};