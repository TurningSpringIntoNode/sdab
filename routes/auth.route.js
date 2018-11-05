const express = require('express');
const router = express.Router();
const passport = require('passport');

const authCtrl = require('../controllers/auth.controller');

const User = require('../models/user.model');
const Roles = require('../models/roles');

const authMiddleware = require('../middlewares/auth');

const parseUserData = (req, res, next) => {
  const { name, gender, birth, email, password, checkPassword } = req.body;

  if (password != checkPassword) {
    return res
      .status(400)
      .send({
        status: 'error',
        message: 'Password and confirmation password differs'
      });
  }

  const user = new User({
    name,
    gender,
    birth,
    email,
    password
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
    const roleInstance = new Roles[role]({});
    req.role = roleInstance;
    next();
  };
};

router.post('/signup/social', parseUserData, setupRole('Account'), authCtrl.signupSocial);
router.post('/login/social', passport.authenticate('Local', { session: false }), authCtrl.loginSocial);

router.all('/admin/*', authMiddleware.authenticate);
router.all('/admin/*', authMiddleware.hasRole('Admin'));
router.post('/admin/', parseUserData, setupRole('Admin'), authCtrl.signupSocial);

module.exports = router;