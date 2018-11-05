process.env.TEST_SUITE = 'auth';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../app');

describe('Auth', () => {

  test('Signup & login', (done) => {
    const user = {
      name: 'Felipe',
      email: 'ff@ff.com',
      gender: 'MALE',
      birth: '01/01/1901',
      password: 'lolo',
      checkPassword: 'lolo'
    };
    request(app)
      .post('/signup/social')
      .send(user)
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('OK');
        expect(res.content).to.have.property('token');
        request(app)
          .post('/login/social')
          .send({
            email: user.email,
            password: user.password
          })
          .expect(200)
          .end(done);
      });
  });
});