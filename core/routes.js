const express = require('express');

const passport = require('passport');

const logMiddleware = require('../middlewares/log.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');
const commentMiddleware = require('../middlewares/comment.middleware');
const evaluationMiddleware = require('../middlewares/evaluation.middleware');
const paginationMiddleware = require('../middlewares/pagination.middleware');
const sortingMiddleware = require('../middlewares/sorting.middleware');

const authCtrl = require('../controllers/auth.controller');
const adminCtrl = require('../controllers/admin.controller');
const userCtrl = require('../controllers/user.controller');
const animeCtrl = require('../controllers/anime.controller');
const episodeCtrl = require('../controllers/episode.controller');
const commentCtrl = require('../controllers/comment.controller');
const evaluationCtrl = require('../controllers/evaluation.controller');

const { thumbParser, videoParser } = require('./cloudinary');

const routes = (app) => {
  const router = express.Router();

  router.all('/*',
    logMiddleware.logIp);

  /**
   * @apiDefine UserNotFound
   *    User was not found in database
   */
  /**
   * @apiDefine AlreadyRegisteredUser
   *    User already has been registered
   */
  /**
   * @api {post} /signup/social Request creation of new user using email and password
   * @apiName SignupSocial
   * @apiGroup Auth
   *
   * @apiParam (Request Body) {String} name User name
   * @apiParam (Request Body) {String} email User email
   * @apiParam (Request Body) {String} password User password
   * @apiParam (Request Body) {String} checkPassword User password confirmation
   *
   * @apiSuccess {Object} user Basic information of user
   * @apiSuccess {String} user.role Role of the user
   * @apiSuccess {String} token Token to have access in future requests
   *
   * @apiError AlreadyRegisteredUser User that wants to signup has alrealdy registered before
   */
  router.post('/signup/social',
    userMiddleware.parseUserData,
    userMiddleware.setupRole('Account'),
    authCtrl.signupSocial);

  /**
   * @api {post} /login/social Request token using social login
   * @apiName LoginSocial
   * @apiGroup Auth
   *
   * @apiParam (Request Body) {String} email User email
   * @apiParam (Request Body) {String} password User password
   *
   * @apiSuccess {Object} user Basic information of user
   * @apiSuccess {String} user.role Role of the user
   * @apiSuccess {String} token Token to have access in future requests
   *
   * @apiError UserNotFound User was not registered before trying login
   */
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
  router.get('/me/comments',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    commentCtrl.getCommentsOfUser);
  router.get('/me/animes/:animeId/comments',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    commentMiddleware.parseCommentedObject('animeId'),
    commentCtrl.getCommentsOfUser);
  router.get('/me/animes/:animeId/episodes/:episodeId/comments',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    commentMiddleware.parseCommentedObject('episodeId'),
    commentCtrl.getCommentsOfUser);
  router.get('/me/evaluations',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    evaluationCtrl.getEvaluationsOfUser);
  router.get('/me/animes/:animeId/evaluations',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    evaluationMiddleware.parseEvaluatedObject('animeId'),
    evaluationCtrl.getEvaluationsOfUser);
  router.get('/me/animes/:animeId/episodes/:episodeId/comments',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    evaluationMiddleware.parseEvaluatedObject('episodeId'),
    evaluationCtrl.getEvaluationsOfUser);
  router.delete('/me',
    authMiddleware.authenticate,
    userCtrl.deleteOwnUser);

  router.get('/animes',
    paginationMiddleware.addPagination,
    sortingMiddleware.addSorting(['createdAt', 'name'], ['asc', 'desc'], {
      sortBy: 'createdAt',
      order: 'desc',
    }),
    animeCtrl.getAnimes);

  router.get('/animes/genres',
    paginationMiddleware.addPagination,
    animeCtrl.getGenres);
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
    paginationMiddleware.addPagination,
    commentMiddleware.parseCommentedObject('animeId'),
    commentCtrl.getComments);
  router.post('/animes/:animeId/comments',
    authMiddleware.authenticate,
    commentMiddleware.parseCommentData,
    commentMiddleware.parseCommentedObject('animeId'),
    commentCtrl.createComment);
  router.get('/animes/:animeId/evaluations',
    evaluationMiddleware.parseEvaluatedObject('animeId'),
    evaluationCtrl.getEvaluations);
  router.post('/animes/:animeId/evaluations',
    authMiddleware.authenticate,
    evaluationMiddleware.parseEvaluationData,
    evaluationMiddleware.parseEvaluatedObject('animeId'),
    evaluationCtrl.createEvaluation);


  router.get('/animes/:animeId/episodes',
    paginationMiddleware.addPagination,
    sortingMiddleware.addSorting(['chapter'], ['asc', 'desc'], {
      sortBy: 'chapter',
      order: 'asc',
    }),
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
    paginationMiddleware.addPagination,
    commentMiddleware.parseCommentedObject('episodeId'),
    commentCtrl.getComments);
  router.post('/animes/:animeId/episodes/:episodeId/comments',
    authMiddleware.authenticate,
    commentMiddleware.parseCommentData,
    commentMiddleware.parseCommentedObject('episodeId'),
    commentCtrl.createComment);
  router.get('/animes/:animeId/episodes/:episodeId/evaluations',
    evaluationMiddleware.parseEvaluatedObject('episodeId'),
    evaluationCtrl.getEvaluations);
  router.post('/animes/:animesId/episodes/:episodeId/evaluations',
    authMiddleware.authenticate,
    evaluationMiddleware.parseEvaluationData,
    evaluationMiddleware.parseEvaluatedObject('episodeId'),
    evaluationCtrl.createEvaluation);

  router.put('/comments/:commentId',
    authMiddleware.authenticate,
    commentMiddleware.parseCommentData,
    commentCtrl.updateComment);
  router.delete('/comments/:commentId',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    commentCtrl.deleteComment);

  router.put('/evaluations/:evaluationId',
    authMiddleware.authenticate,
    evaluationMiddleware.parseEvaluationData,
    evaluationCtrl.updateEvaluation);
  router.delete('/evaluations/:evaluationId',
    authMiddleware.authenticate,
    authMiddleware.hasRole(['Admin']),
    evaluationCtrl.deleteEvaluation);

  app.use(router);
};

module.exports = routes;
