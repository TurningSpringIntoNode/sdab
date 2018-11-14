process.env.TEST_SUITE = 'anime';

const request = require('supertest');
const expect = require('chai').expect;

const config = require('../app.config');

const app = require('../app');

const { Anime, User } = require('../core/mongodb').mongoose.models;

const authUtils = require('./utils/auth');
const populators = require('./utils/populators');

beforeEach(async () => {
  await populators.populateAnime();
});

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
            genre: 'LOL',
            resume: 'LOL',
            thumb: 'none',
            thumb_id: 'fuck',
          })
          .expect(200)
          .then(res => res.body)
          .then(res => {

            done();
          })
      });
  });

  test('Get animes', async (done) => {

    const animes = await Anime.find({});
    request(app)
      .get('/animes')
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('OK');
        expect(res.message).to.eql('OK');
        expect(res.content.animes.length).to.eql(animes.length);
        done();
      });
  });

});

