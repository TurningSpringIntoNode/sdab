const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const userCtrl = require('../controllers/user.controller');

router.get('/me', authMiddleware.authenticate, (req, res) => res.send({
  status: 'OK',
  message: 'OK',
  content: req.user,
}));

router.delete('/me', authMiddleware.authenticate, userCtrl.deleteOwnUser);

module.exports = router;
