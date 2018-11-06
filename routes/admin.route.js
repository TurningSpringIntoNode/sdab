const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

router.all('/admin/*', authMiddleware.authenticate);
router.all('/admin/*', authMiddleware.hasRole(['Admin']));
router.post('/admin/', userMiddleware.parseUserData, userMiddleware.setupRole('Admin'), authCtrl.signupSocial);

module.exports = router;