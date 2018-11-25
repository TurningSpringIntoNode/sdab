process.env.TEST_SUITE = 'episode';

const request = require('supertest');
const expect = require('chai').expect;

const config = require('../app.config');

const app = require('../app');

const { Anime, User, Episode } = require('../core/mongodb').mongoose.models;

const authUtils = require('./utils/auth');
const populators = require('./utils/populators');

beforeAll(async () => {
  await populators.populateAnime();
  await populators.populateEpisode();
});


describe('create episode', () => {

  test('upload episode', async (done) => {
    const animes = await Anime.find({});

    const token = await authUtils.getAdminToken();
    
    request(app)
      .post(`/animes/${animes[0]._id.toHexString()}/episodes/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        name: 'episode 1',
        chapter: '1',
        description: 'Ababa',
        video: 'wuau',
        video_id: 'demod'
      })
      .expect(200)
      .then(res => res.body)
      .then(res => {
        done();
      });
  });

  test('Get episodes', async (done) => {
    const animes = await Anime.find({});

    const episodes = await Episode.find({ anime: animes[0]._id.toHexString()});

    request(app)
      .get(`/animes/${animes[0]._id.toHexString()}/episodes/`)
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('OK');
        expect(res.message).to.eql('OK');
        expect(res.content.episodes.length).to.deep.equal(episodes.length);
        done();
      });
  });

  test('Get episode by id', async (done) => {
    const animes = await Anime.find({});

    const episodes = await Episode.find({ anime: animes[0]._id.toHexString()});

    request(app)
      .get(`/animes/${animes[0]._id.toHexString()}/episodes/${episodes[0]._id.toHexString()}`)
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('OK');
        expect(res.message).to.eql('OK');
        done();
      });
  });

  test('Get inexistent episode', async (done) => {
    const animes = await Anime.find({});

    const episodes = await Episode.find({ anime: animes[0]._id.toHexString()});

    await Episode.deleteOne({ _id: episodes[0]._id.toHexString() });

    request(app)
      .get(`/animes/${animes[0]._id.toHexString()}/episodes/${episodes[0]._id.toHexString()}`)
      .expect(404)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('ERROR');
        expect(res.message).to.eql('Episode not found');
        done();
      });
  });

  test('Update episode', async (done) => {
    const animes = await Anime.find({});

    const episodes = await Episode.find({ anime: animes[0]._id.toHexString()});

    authUtils
      .getAdminToken()
      .then(token => {
        request(app)
          .put(`/animes/${animes[0]._id.toHexString()}/episodes/${episodes[0]._id.toHexString()}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            name: 'test_ep_5',
            chapter: 'x5',
            description: 'test episode 5',
            video: {
              id: '5',
              url: 'episodes.com/5',
            },
          })
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.eql('OK');
            expect(res.message).to.eql('OK');
            done();
          });
      });
  });

  test('Delete episodes', async (done) => {
    const animes = await Anime.find({});

    const episodes = await Episode.find({ anime: animes[0]._id.toHexString()});

    authUtils
      .getAdminToken()
      .then(token => {
        request(app)
          .delete(`/animes/${animes[0]._id.toHexString()}/episodes/${episodes[0]._id.toHexString()}`)
          .set('authorization', `Bearer ${token}`)
          .send()
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.eql('OK');
            expect(res.message).to.eql('OK');
            done();
          });
      });
  });
});