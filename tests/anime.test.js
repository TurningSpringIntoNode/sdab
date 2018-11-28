process.env.TEST_SUITE = 'anime';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../app');

const { Anime } = require('../core/mongodb').mongoose.models;

const authUtils = require('./utils/auth');
const populators = require('./utils/populators');

beforeAll(async () => {
  await populators.populateAnime();
  await populators.populateEpisode();
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

  test('Update anime', async (done) => {
    const animes = await Anime.find({});

    authUtils
      .getAdminToken()
      .then(token => {
        request(app)
          .put(`/animes/${animes[0]._id.toHexString()}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            name: 'test4',
            genre: 'waba',
            thumb_id: '4',
            thumb: 'animes.com/4',
            resume: 'Test for anime number 4'
          })
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.eql('OK');
            expect(res.message).to.eql('OK');
            done();
          });
      })
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

});


describe('Options get anime', () => {

  test('Get animes with sortBy', async (done) => {

    const animes = await Anime.find({});
    request(app)
      .get('/animes?sortBy=name')
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('OK');
        expect(res.message).to.eql('OK');
        expect(res.content.animes.length).to.eql(animes.length);
        done();
      });
  });

  test('Get animes with order', async (done) => {

    const animes = await Anime.find({});
    request(app)
      .get('/animes?order=asc')
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('OK');
        expect(res.message).to.eql('OK');
        expect(res.content.animes.length).to.eql(animes.length);
        done();
      });
  });

  test('Get animes with pages', async (done) => {

    request(app)
      .get('/animes?page=1&pageSize=1')
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('OK');
        expect(res.message).to.eql('OK');
        expect(res.content.animes.length).to.eql(1);
        done();
      });
  });

  test('Invalid sort by', (done) => {

    request(app)
      .get('/animes?sortBy=meh')
      .expect(400)
      .end(done);
  });

  test('Invalid order', (done) => {

    request(app)
      .get('/animes?order=meh')
      .expect(400)
      .end(done);
  });

  test('Invalid page', (done) => {

    request(app)
      .get('/animes?page=meh')
      .expect(400)
      .end(done);
  });

  test('Invalid pageSize(meh)', (done) => {

    request(app)
      .get('/animes?pageSize=meh')
      .expect(400)
      .end(done);
  });

  test('Invalid pageSize(0)', (done) => {

    request(app)
      .get('/animes?pageSize=0')
      .expect(400)
      .end(done);
  });

  test('Invalid pageSize(31)', (done) => {

    request(app)
      .get('/animes?pageSize=31')
      .expect(400)
      .end(done);
  });
});