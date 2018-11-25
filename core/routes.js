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
   * @apiDefine ResponseBasicFormat
   * @apiSuccess {String} status Api status to request
   * @apiSuccess {String} message Message to explain result of the request
   * @apiSuccess {Object} content Object that contains result of the request
   */

  /**
   * @apiDefine AnimeUniqueIdParam
   * @apiParam {String} animeId Anime unique id
   */

  /**
   * @apiDefine EpisodeUniqueIdParam
   * @apiParam {String} episodeId Episode unique id
   */

  /**
   * @apiDefine CommentUniqueIdParam
   * @apiParam {String} commentId Comment unique id
   */

  /**
   * @apiDefine Pagination
   * @apiParam (Query Param) {Number{1..}} [page=1] Number of the page being requested 1-indexed
   * @apiParam (Query Param) {Number{1..30}} [pageSize=20] Size of each page
   */

  /**
   * @apiDefine Sorting
   * @apiParam (Query Param) {String="asc","desc"} [order="desc"] Specify order to be sorted either ascending or descending
   * @apiParam (Query Param) {String} [sortBy] Specify field of the model to be used to sort, some fields may be unvailablee
   */

  /**
   * @apiDefine Search
   * @apiParam (Query Param) {String} [search] Search in name field
   */

  /**
   * @apiDefine RequiresAuth
   * @apiHeader {String} authorization Token of access
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       "authorization": "Bearer aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-aaaaaaaaaaaa "
   *     }
   */

  /**
   * @apiDefine AnimeResponse
   * @apiSuccess {Anime[]} content.anime Anime
   * @apiSuccess {String} content.anime.id Anime unique id
   * @apiSuccess {String} content.anime.name Anime name
   * @apiSuccess {String} content.anime.genre Anime genre
   * @apiSuccess {Number} content.anime.score Anime score, based in evaluations
   * @apiSuccess {String} content.anime.resume Anime resume
   * @apiSuccess {Date} content.anime.createdAt Anime creation date
   */

  /**
   * @apiDefine ArrayOfCommentsResponse
   * @apiSuccess {Comment[]} content.comments List of comments
   * @apiSuccess {String} content.comments.id Comment unique id
   * @apiSuccess {String} content.comments.message Comment messsage
   * @apiSuccess {Date} content.comments.createdAt Date of creation of the comment
   * @apiSuccess {Date} content.comments.updatedAt Date of the last update of the comment
   */

  /**
   * @apiDefine ArrayOfEvaluationsResponse
   * @apiSuccess {Evaluation[]} content.evaluations List of evaluations
   * @apiSuccess {String} content.evaluations.id Evaluation unique id
   * @apiSuccess {Number} content.evaluations.score Score given in the evaluation
   */

  /**
   * @apiDefine ArrayOfAnimesResponse
   * @apiSuccess {Anime[]} content.animes List of animes
   * @apiSuccess {String} content.animes.id Anime unique id
   * @apiSuccess {String} content.animes.name Anime name
   * @apiSuccess {String} content.animes.genre Anime genre
   * @apiSuccess {Number} content.animes.score Anime score, based in evaluations
   * @apiSuccess {String} content.animes.resume Anime resume
   * @apiSuccess {Date} content.animes.createdAt Anime creation date
   */

  /**
   * @apiDefine AnimeBody
   * @apiParam (Request Body) {String} name
   * @apiParam (Request Body) {String} genre
   * @apiParam (Request Body) {String} resume
   * @apiParam (Request Body) {File} thumb
   */

  /**
   * @api {post} /signup/social Creates new user using email and password
   * @apiName SignupSocial
   * @apiGroup Auth
   *
   * @apiPermission none
   *
   * @apiParam (Request Body) {String} name User name
   * @apiParam (Request Body) {String} email User email
   * @apiParam (Request Body) {String} password User password
   * @apiParam (Request Body) {String} checkPassword User password confirmation
   *
   * @apiUse ResponseBasicFormat
   * @apiSuccess {Object} content.user Basic information of user
   * @apiSuccess {String} content.user.role Role of the user
   * @apiSuccess {String} content.token Token to have access in future requests
   *
   * @apiError AlreadyRegisteredUser User that wants to signup has alrealdy registered before
   */
  router.post('/signup/social',
    userMiddleware.parseUserData,
    userMiddleware.setupRole('Account'),
    authCtrl.signupSocial);

  /**
   * @api {post} /login/social Login user using social login
   * @apiName LoginSocial
   * @apiGroup Auth
   *
   * @apiPermission none
   *
   * @apiParam (Request Body) {String} email User email
   * @apiParam (Request Body) {String} password User password
   *
   * @apiUse ResponseBasicFormat
   * @apiSuccess {Object} content.user Basic information of user
   * @apiSuccess {String} content.user.role Role of the user
   * @apiSuccess {String} content.token Token to have access in future requests
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

  /**
   * @api {post} /admin/ Creates new admin using email and password
   * @apiName PostAdmin
   * @apiGroup Admin
   *
   * @apiUse RequiresAuth
   *
   * @apiPermission admin
   *
   * @apiParam (Request Body) {String} name User name
   * @apiParam (Request Body) {String} email User email
   * @apiParam (Request Body) {String} password User password
   * @apiParam (Request Body) {String} checkPassword User password confirmation
   *
   * @apiUse ResponseBasicFormat
   * @apiSuccess {Object} content.user Basic information of user
   * @apiSuccess {String} content.user.role Role of the user
   * @apiSuccess {String} content.token Token to have access in future requests
   *
   * @apiError AlreadyRegisteredUser User that wants to signup has alrealdy registered before
   */
  router.post('/admin/',
    userMiddleware.parseUserData,
    userMiddleware.setupRole('Admin'),
    authCtrl.signupSocial);
  /**
   * @api {delete} /admin/users/:id Deletes a user
   * @apiName DeleteUser
   * @apiGroup Admin
   *
   * @apiUse RequiresAuth
   *
   * @apiPermission admin
   *
   * @apiParam {String} id User unique id
   *
   * @apiUse ResponseBasicFormat
   *
   */
  router.delete('/admin/users/:id',
    adminCtrl.deleteUserById);

  /**
   * @api {get} /me Get logged in user information
   * @apiName GetOwnInformation
   * @apiGroup User
   *
   * @apiUse RequiresAuth
   *
   * @apiPermission user
   *
   * @apiUse ResponseBasicFormat
   * @apiSuccess {Object} content.user User information
   * @apiSuccess {String} content.user.name User name
   * @apiSuccess {String} content.user.email User email
   * @apiSuccess {String} content.user.role User role
   */
  router.get('/me',
    authMiddleware.authenticate,
    userCtrl.getUser);

  /**
   * @api {get} /me/comments Get comments of the logged in user
   * @apiName GetOwnComments
   * @apiGroup User
   *
   * @apiUse RequiresAuth
   *
   * @apiUse Pagination
   *
   * @apiPermission user
   *
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfCommentsResponse
   */
  router.get('/me/comments',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    commentCtrl.getCommentsOfUser);
  /**
   * @api {get} /me/animes/:animeId/comments Get comments of the logged in user in specific anime
   * @apiName GetOwnCommentsInAnime
   * @apiGroup User
   *
   * @apiUse AnimeUniqueIdParam
   *
   * @apiUse RequiresAuth
   *
   * @apiUse Pagination
   *
   * @apiPermission user
   *
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfCommentsResponse
   */
  router.get('/me/animes/:animeId/comments',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    commentMiddleware.parseCommentedObject('animeId'),
    commentCtrl.getCommentsOfUser);

  /**
   * @api {get} /me/animes/:animeId/episodes/:episodeId/comments Get comments of the logged in user in specific anime episode
   * @apiName GetOwnCommentsInEpisode
   * @apiGroup User
   *
   * @apiUse AnimeUniqueIdParam
   * @apiUse EpisodeUniqueIdParam
   *
   * @apiUse RequiresAuth
   *
   * @apiUse Pagination
   *
   * @apiPermission user
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfCommentsResponse
   */
  router.get('/me/animes/:animeId/episodes/:episodeId/comments',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    commentMiddleware.parseCommentedObject('episodeId'),
    commentCtrl.getCommentsOfUser);
  /**
   * @api {get} /me/evaluations Get evaluations of logged in user
   * @apiName GetOwnEvaluations
   * @apiGroup User
   *
   * @apiUse RequiresAuth
   *
   * @apiUse Pagination
   *
   * @apiPermission user
   *
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfEvaluationsResponse
   */
  router.get('/me/evaluations',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    evaluationCtrl.getEvaluationsOfUser);
  /**
   * @api {get} /me/animes/:animeId/evaluations Get evaluations of logged in user in specific anime
   * @apiName GetOwnEvaluationsInAnime
   * @apiGroup User
   *
   * @apiUse AnimeUniqueIdParam
   *
   * @apiUse RequiresAuth
   *
   * @apiUse Pagination
   *
   * @apiPermission user
   *
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfEvaluationsResponse
   */
  router.get('/me/animes/:animeId/evaluations',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    evaluationMiddleware.parseEvaluatedObject('animeId'),
    evaluationCtrl.getEvaluationsOfUser);
  /**
   * @api {get} /me/animes/:animeId/episodes/:episodeId/evaluations Get evaluations of logged in user in specific anime episode
   * @apiName GetOwnEvaluationsInAnimeEpisode
   * @apiGroup User
   *
   * @apiUse AnimeUniqueIdParam
   * @apiUse EpisodeUniqueIdParam
   *
   * @apiUse RequiresAuth
   *
   * @apiUse Pagination
   *
   * @apiPermission user
   *
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfEvaluationsResponse
   */
  router.get('/me/animes/:animeId/episodes/:episodeId/evaluations',
    authMiddleware.authenticate,
    paginationMiddleware.addPagination,
    evaluationMiddleware.parseEvaluatedObject('episodeId'),
    evaluationCtrl.getEvaluationsOfUser);
  /**
   * @api {delete} /me Deletes all information of logged in user
   * @apiName DeleteOwnUser
   * @apiGroup User
   *
   * @apiUse RequiresAuth
   *
   * @apiPermission user
   *
   * @apiUse ResponseBasicFormat
   */
  router.delete('/me',
    authMiddleware.authenticate,
    userCtrl.deleteOwnUser);

  /**
   * @api {get} /animes Get all registered animes
   * @apiName GetAnimes
   * @apiGroup Anime
   *
   * @apiUse Pagination
   * @apiUse Sorting
   * @apiUse Search
   *
   * @apiPermission none
   *
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfAnimesResponse
   */
  router.get('/animes',
    paginationMiddleware.addPagination,
    sortingMiddleware.addSorting(['createdAt', 'name'], ['asc', 'desc'], {
      sortBy: 'createdAt',
      order: 'desc',
    }),
    animeCtrl.getAnimes);

  /**
   * @api {get} /animes/genres Get all distinct genre of registered animes
   * @apiName GetGenres
   * @apiGroup Anime
   *
   * @apiUse Pagination
   *
   * @apiPermission none
   *
   * @apiUse ResponseBasicFormat
   * @apiSuccess {String[]} content.genres List of genres
   */
  router.get('/animes/genres',
    paginationMiddleware.addPagination,
    animeCtrl.getGenres);

  /**
   * @api {get} /animes/:animeId Get specific anime
   * @api GetAnime
   * @apiGroup Anime
   *
   * @apiUse AnimeUniqueIdParam
   *
   * @apiPermission none
   *
   * @apiUse ResponseBasicFormat
   * @apiUse AnimeResponse
   */
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
  /**
   * @api {get} /animes/:animeId/comments Get all comments in a specific anime
   * @apiName GetAnimeComments
   * @apiGroup Anime
   *
   * @apiUse AnimeUniqueIdParam
   *
   * @apiUse RequiresAuth
   *
   * @apiUse Pagination
   *
   * @apiPermission none
   *
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfCommentsResponse
   */
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

  /**
   * @api {get} /animes/:animeId/episodes/:episodeId/comments Get all comments in a specific anime episode
   * @apiName GetEpisodeComments
   * @apiGroup Episode
   *
   * @apiUse AnimeUniqueIdParam
   * @apiUse EpisodeUniqueIdParam
   *
   * @apiUse RequiresAuth
   *
   * @apiUse Pagination
   *
   * @apiPermission none
   *
   * @apiUse ResponseBasicFormat
   * @apiUse ArrayOfCommentsResponse
   */
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
