process.env.TEST_SUITE = 'episode';

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
});