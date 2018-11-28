const request = require('supertest');

const config = require('../../app.config');
const app = require('../../app');

const { users } = require('./populators');

const getAdminToken = () => request(app)
  .post('/login/social')
  .send({
    email: config.admin.email,
    password: config.admin.password,
  })
  .expect(200)
  .then(res => res.body)
  .then(res => res.content.token);

const getUserToken = () => {
  const user = users[Math.floor(Math.random() * users.length)];
  return request(app)
    .post('/login/social')
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(200)
    .then(res => res.body)
    .then(res => res.content.token);
};

module.exports = {
  getAdminToken,
  getUserToken,
};
