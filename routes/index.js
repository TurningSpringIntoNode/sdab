const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/me', authenticate, function(req, res) {
  res.send(req.user);
});

module.exports = router;
