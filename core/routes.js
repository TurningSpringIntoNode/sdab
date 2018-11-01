const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');

const routes = app => {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
};

module.exports = routes;