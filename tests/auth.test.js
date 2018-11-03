process.env.TEST_SUITE = 'auth';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../app');

describe('Auth', () => {

  test('Signup & login', (done) => {
    request(app)
      .post('/auth/signup')
      .send({
        email: 'ff@mail.com',
        password: '12345678'
      })
      .expect(200)
      .then(res => res.body)
      .then(() => {
        request(app)
          .post('/auth/login')
          .send({
            username: 'ff@mail.com',
            password: '12345678'
          })
          .expect(200)
          .end(done);
      });
  });
});