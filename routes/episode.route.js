const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');

const episodeCtrl = require('../controllers/episode.controller');

const { videoParser } = require('../core/cloudinary');

const router = express.Router();

router.get('/animes/:anime_id/episodes', episodeCtrl.getEpisodes);
router.get('/animes/:anime_id/episodes/:id', episodeCtrl.getEpisodeById);
router.post('/animes/:anime_id/episodes', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), videoParser.single('video'), episodeCtrl.createEpisode);
router.put('/animes/:anime_id/episodes/:id', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), videoParser.single('video'), episodeCtrl.updateEpisode);
router.delete('/animes/:anime_id/episodes/:id', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), episodeCtrl.deleteEpisode);

module.exports = router;
