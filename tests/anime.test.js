process.env.TEST_SUITE = 'anime';

const request = require('supertest');
const expect = require('chai').expect;

const config = require('../app.config');

const app = require('../app');

const { Anime, User } = require('../core/mongodb').mongoose.models;

const authUtils = require('./utils/auth');

describe('Create anime', () => {

  test('upload anime', (done) => {
    authUtils
      .getAdminToken()
      .then(token => {
        request(app)
          .post('/animes')
          .set('authorization', `Bearer ${token}`)
          .send({
            name: 'Test',
            gender: 'LOL',
            resume: 'LOL',
            thumb: 'none'
          })
          .expect(200)
          .then(res => res.body)
          .then(res => {
            console.log(res);
            done();
          })
      });
  });

});

