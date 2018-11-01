var express = require('express');
var router = express.Router();

/* GET home page. */
const passport = require('passport');
router.post('/', passport.authenticate('local', {session: false}), function(req, res, next) {
  res.send('It works');
});

module.exports = router;
