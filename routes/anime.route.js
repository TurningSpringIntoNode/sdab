const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');

const animeCtrl = require('../controllers/anime.controller');

const { thumbParser } = require('../core/cloudinary');

const router = express.Router();


router.post('/animes', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), thumbParser.single('thumb'), animeCtrl.createAnime);

module.exports = router;
