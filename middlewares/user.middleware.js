const User = require('../config/mongodb').mongoose.models.User;

const Account = require('../config/mongodb').mongoose.models.Account;
const Admin = require('../config/mongodb').mongoose.models.Admin;

const Roles = {
  Account,
  Admin,
};

const parseUserData = (req, res, next) => {
  const {
    name, gender, birth, email, password, checkPassword,
  } = req.body;

  if (password != checkPassword) {
    return res
      .status(400)
      .send({
        status: 'error',
        message: 'Password and confirmation password differs',
      });
  }

  const user = new User({
    name,
    gender,
    birth,
    email,
    password,
  });

  const error = user.validateSync();

  if (error) {

  } else {
    req.user = user;
    next();
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
