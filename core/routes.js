const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth.route');
const adminRouter = require('../routes/admin.route');

const routes = (app) => {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use(authRouter);
  app.use(adminRouter);
};

module.exports = routes;
