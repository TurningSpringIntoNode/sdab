const passport = require('passport');
const config = require('../app.config');

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (email, password, done) {
    
  }
));