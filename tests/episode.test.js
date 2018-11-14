process.env.TEST_SUITE = 'episode';

const request = require('supertest');
const expect = require('chai').expect;

const config = require('../app.config');

const app = require('../app');

const { Anime, User, Episode } = require('../core/mongodb').mongoose.models;

const authUtils = require('./utils/auth');
const populators = require('./utils/populators');

beforeEach(async () => {
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
});