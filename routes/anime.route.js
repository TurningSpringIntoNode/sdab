const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');

const animeCtrl = require('../controllers/anime.controller');

const { thumbParser } = require('../core/cloudinary');

const router = express.Router();

router.get('/animes', animeCtrl.getAnimes);
router.get('/animes/:id', animeCtrl.getAnimeById);
router.post('/animes', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), thumbParser.single('thumb'), animeCtrl.createAnime);
router.put('/animes/:id', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), thumbParser.single('thumb'), animeCtrl.updateAnime);
router.delete('/animes/:id', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), animeCtrl.deleteAnime);
router.get('/animes/:id/comments', animeCtrl.getComments);
router.post('/animes/:id/comments', authMiddleware.authenticate, animeCtrl.addComment);

module.exports = router;
