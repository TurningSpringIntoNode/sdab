const express = require('express');

const router = express.Router();
const passport = require('passport');

const authCtrl = require('../controllers/auth.controller');
const userMiddleware = require('../middlewares/user.middleware');

router.post('/signup/social', userMiddleware.parseUserData, userMiddleware.setupRole('Account'), authCtrl.signupSocial);
router.post('/login/social', passport.authenticate('Local', { session: false }), authCtrl.loginSocial);

module.exports = router;
