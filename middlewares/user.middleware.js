const { User } = require('../core/mongodb').mongoose.models;

const { Account } = require('../core/mongodb').mongoose.models;
const { Admin } = require('../core/mongodb').mongoose.models;

const Roles = {
  Account,
  Admin,
};

const parseUserData = (req, res, next) => {
  const {
    name, gender, birth, email, password, checkPassword,
  } = req.body;

  if (password !== checkPassword) {
    res
      .status(400)
      .send({
        status: 'error',
        message: 'Password and confirmation password differs',
      });
  } else {
    const user = new User({
      name,
      gender,
      birth,
      email,
      password,
    });

    const error = user.validateSync();

    if (error) {
      // TODO
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
