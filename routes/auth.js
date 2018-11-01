const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.post('/signup', async (req, res) => {
  const password = await User.encryptPassword(req.body.password);

  User
    .findOne({ email: req.body.email })
    .then(fdUser => {
      if (fdUser) {
        return res.sendStatus(400);
      }
      const user = new User({
        email: req.body.email,
        password,
      });
      user
        .save()
        .then(dbUser => {
          dbUser
          .generateAuthToken()
          .then(token => {
            res.send({
              token
            })
          })
        });
    });
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  res.send(req.user);
});

module.exports = router;