const authRouter = require('../routes/auth.route');
const adminRouter = require('../routes/admin.route');
const indexRouter = require('../routes/index.route');

const routes = (app) => {
  app.use(authRouter);
  app.use(adminRouter);
  app.use(indexRouter);
};

module.exports = routes;
