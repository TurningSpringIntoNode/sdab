const passport = require('passport');
const config = require('../app.config');

const LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy(
  function (email, password, done) {
    done(null, true, {
      email,
      password
    });
  }
));