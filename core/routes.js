const authRouter = require('../routes/auth.route');
const adminRouter = require('../routes/admin.route');
const indexRouter = require('../routes/index.route');
const animeRouter = require('../routes/anime.route');
const episodeRouter = require('../routes/episode.route');

const routes = (app) => {
  app.use(authRouter);
  app.use(adminRouter);
  app.use(indexRouter);
  app.use(animeRouter);
  app.use(episodeRouter);
};

module.exports = routes;
