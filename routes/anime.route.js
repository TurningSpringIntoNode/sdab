const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');

const animeCtrl = require('../controllers/anime.controller');

const episodeRouter = require('./episode.route');

let { thumbParser } = require('../core/cloudinary');

const router = express.Router();

router.get('/animes', animeCtrl.getAnimes);
router.post('/animes', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), thumbParser.single('thumb'), animeCtrl.createAnime);
router.delete('/animes/:id', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), animeCtrl.deleteAnime);

router.use('/animes/:anime_id', episodeRouter);

module.exports = router;
