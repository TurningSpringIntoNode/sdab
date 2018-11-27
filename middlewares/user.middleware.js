const { User } = require('../core/mongodb').mongoose.models;

const { Account } = require('../core/mongodb').mongoose.models;
const { Admin } = require('../core/mongodb').mongoose.models;

const Roles = {
  Account,
  Admin,
};

const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const parseUserData = (req, res, next) => {
  const {
    name, email, password, checkPassword,
  } = req.body;

  if (password !== checkPassword) {
    responseWriter.badResponse(res, 400, constants.DIFF_PASSWORD_CONFIRM);
  } else {
    const user = new User({
      name,
      email,
      password,
    });

    const error = user.validateSync();

    if (error) {
      responseWriter.badResponse(res, 500, constants.ERROR);
    } else {
      req.user = user;
      next();
    }
  }
};

const setupRole = (role) => {
  if (!Roles[role]) {
    throw new Error('Invalid role requested');
  }
  return (req, res, next) => {
    req.role = role;
    next();
  };
};

module.exports = {
  parseUserData,
  setupRole,
};
