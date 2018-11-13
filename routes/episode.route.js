const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');

const episodeCtrl = require('../controllers/episode.controller');

const { videoParser } = require('../core/cloudinary');

const router = express.Router();

router.post('/episodes', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), videoParser.single('video'), episodeCtrl.createEpisode);
router.delete('/episodes/:id', authMiddleware.authenticate, authMiddleware.hasRole(['Admin']), episodeCtrl.deleteEpisode);

module.exports = router;
