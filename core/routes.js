const express = require('express');

const passport = require('passport');

const logMiddleware = require('../middlewares/log.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');
const commentMiddleware = require('../middlewares/comment.middleware');

const authCtrl = require('../controllers/auth.controller');
const adminCtrl = require('../controllers/admin.controller');
const userCtrl = require('../controllers/user.controller');
const animeCtrl = require('../controllers/anime.controller');
const episodeCtrl = require('../controllers/episode.controller');
const commentCtrl = require('../controllers/comment.controller');

const { thumbParser, videoParser } = require('./cloudinary');


const routes = (app) => {

  const router = express.Router();

  router.all('/*',
    logMiddleware.logIp);

  router.post('/signup/social',
    userMiddleware.parseUserData,
    userMiddleware.setupRole('Account'),
    authCtrl.signupSocial);

  router.post('/login/social',
    passport.authenticate('Local', { session: false }),
    authCtrl.loginSocial);

  router.all('/admin/*',
    authMiddleware.authenticate);
  router.all('/admin/*',
    authMiddleware.hasRole(['Admin']));
  router.post('/admin/',
    userMiddleware.parseUserData,
    userMiddleware.setupRole('Admin'),
    authCtrl.signupSocial);
  router.delete('/admin/users/:id',
    adminCtrl.deleteUserById);

  router.get('/me',
    authMiddleware.authenticate,
    userCtrl.getUser);

  router.delete('/me',
    authMiddleware.authenticate, userCtrl.deleteOwnUser);

  router.get('/animes',
    animeCtrl.getAnimes);
  router.get('/animes/:animeId',
    animeCtrl.getAnimeById);
  router.post('/animes',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    thumbParser.single('thumb'),
    animeCtrl.createAnime);
  router.put('/animes/:animeId',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    thumbParser.single('thumb'),
    animeCtrl.updateAnime);
  router.delete('/animes/:animeId',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    animeCtrl.deleteAnime);
  router.get('/animes/:animeId/comments',
    commentMiddleware.parseCommentedAt('animeId'),
    commentCtrl.getComments)
  router.post('/animes/:animeId/comments',
    authMiddleware.authenticate,
    commentMiddleware.parseCommentData,
    commentMiddleware.parseCommentedAt('animeId'),
    commentCtrl.createComment);


  router.get('/animes/:animeId/episodes',
    episodeCtrl.getEpisodes);
  router.get('/animes/:animeId/episodes/:episodeId',
    episodeCtrl.getEpisodeById);
  router.post('/animes/:animeId/episodes',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    videoParser.single('video'),
    episodeCtrl.createEpisode);
  router.put('/animes/:animeId/episodes/:episodeId',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    videoParser.single('video'),
    episodeCtrl.updateEpisode);
  router.delete('/animes/:animeId/episodes/:episodeId',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    episodeCtrl.deleteEpisode);
  router.get('/animes/:animeId/episodes/:episodeId/comments',
    commentMiddleware.parseCommentedAt('episodeId'),
    commentCtrl.getComments);
  router.post('/animes/:animeId/episodes/:episodeId/comments',
    authMiddleware.authenticate,
    commentMiddleware.parseCommentData,
    commentMiddleware.parseCommentedAt('episodeId'),
    commentCtrl.createComment);

  router.put('/comments/:commentId',
    authMiddleware.authenticate,
    commentCtrl.updateComment);
  router.delete('/comments/:commentId',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    commentCtrl.deleteComment);

  app.use(router);
};

module.exports = routes;
