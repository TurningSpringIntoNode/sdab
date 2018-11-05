process.env.TEST_SUITE = 'auth';

const request = require('supertest');
const expect = require('chai').expect;

const config = require('../app.config');

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
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.deep.equal('OK');
            expect(res.content).to.have.property('token');
            expect(res.content.role).to.deep.equal('Account');
            done();
          });
      });
  });

  test('Login as default admin', (done) => {
    request(app)
      .post('/login/social')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('OK');
        expect(res.content).to.have.property('token');
        expect(res.content.role).to.deep.equal('Admin');
        done();
      });
  });

  test('Wrong login', (done) => {
    request(app)
      .post('/login/social')
      .send({
        email: 'WW@gm.com',
        password: 'www',
      })
      .expect(400)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('ERROR');
        expect(res.message).to.deep.equal('User not found');
        done();
      });
  });
});