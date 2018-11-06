const authRouter = require('../routes/auth.route');
const adminRouter = require('../routes/admin.route');

const routes = (app) => {
  app.use(authRouter);
  app.use(adminRouter);
};

module.exports = routes;
