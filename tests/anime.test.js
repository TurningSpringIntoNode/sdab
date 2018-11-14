process.env.TEST_SUITE = 'anime';

const request = require('supertest');
const expect = require('chai').expect;

const config = require('../app.config');

const app = require('../app');

const { Anime, User } = require('../core/mongodb').mongoose.models;

const authUtils = require('./utils/auth');
const populators = require('./utils/populators');

beforeAll(async () => {
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

  test('Delete anime', async (done) => {

    const animes = await Anime.find({});

    authUtils
      .getAdminToken()
      .then(token => {
        request(app)
          .delete(`/animes/${animes[0]._id.toHexString()}`)
          .set('authorization', `Bearer ${token}`)
          .expect(200)
          .then(res => res.body)
          .then(async res => {
            expect(res.status).to.eql('OK');
            expect(res.message).to.eql('OK');
            const n_animes = await Anime.find({});
            expect(n_animes.length + 1).to.eql(animes.length);
            done();
          });
      });
  });

  test('Search for inexistent anime', async (done) => {

    const animes = await Anime.find({});

    await Anime.deleteOne({ _id : animes[0]._id.toHexString() });

    request(app)
      .get(`/animes/${animes[0]._id.toHexString()}`)
      .expect(404)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('ERROR');
        expect(res.message).to.eql('Anime not found');
        done();
      });
  });

});

