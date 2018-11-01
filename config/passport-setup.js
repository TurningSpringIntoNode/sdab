const passport = require('passport');
const config = require('../app.config');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use('local', new LocalStrategy(
  function (email, password, done) {
    User
      .findOne({ email })
      .then(fdUser => {
        if (!fdUser) {
          return done({
            error: {
              message: 'User not found'
            }
          });
        }

        User
          .validatePassword(password, fdUser.password)
          .then(samePassword => {
            if (samePassword) {
              done(null, fdUser);
            } else {
              done({
                error: {
                  message: 'Incorrect password'
                }
              });
            }
          })
      });
  }
));