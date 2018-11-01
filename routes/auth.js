const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/signup', async (req, res) => {
  const password = await User.encryptPassword(req.body.password)
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

module.exports = router;