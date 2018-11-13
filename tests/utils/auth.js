const request = require('supertest');

const config = require('../../app.config');
const app = require('../../app');

const getAdminToken = () => request(app)
  .post('/login/social')
  .send({
    email: config.admin.email,
    password: config.admin.password,
  })
  .expect(200)
  .then(res => res.body)
  .then(res => {
    console.log(res);
    return res.content.token
  });

module.exports = {
  getAdminToken,
};
