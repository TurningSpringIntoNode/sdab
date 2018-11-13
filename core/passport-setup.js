const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const config = require('../app.config');

passport.use('Local', new LocalStrategy({
  usernameField: 'email',
},
((email, password, done) => {
  done(null, true, {
    email,
    password,
  });
})));
