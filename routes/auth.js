const express = require('express');
const router = express.Router();
const passport = require('passport');

const authCtrl = require('../controllers/auth.controller');

router.post('/signup', authCtrl.signupSocial);
router.post('/login', passport.authenticate('local', { session: false }), authCtrl.loginSocial);

module.exports = router;