const express = require('express');
const router = express.Router();
const passport = require('passport');

const authCtrl = require('../controllers/auth.controller');
const User = require('../models/user.model');

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

router.use('/signup/social', parseUserData, authCtrl.signupSocial);
router.use('/login/social', passport.authenticate('Local', { session: false }), authCtrl.loginSocial);

module.exports = router;