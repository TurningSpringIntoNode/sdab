process.env.TEST_SUITE = 'evaluation';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../app');

const { Anime, Evaluation } = require('../core/mongodb').mongoose.models;

const authUtils = require('./utils/auth');
const populators = require('./utils/populators');

beforeAll(async () => {
  await populators.populateAnime();
  await populators.populateEpisode();
  await populators.populateUser();
});

describe('Evaluation crud', () => {

  test('Create evaluation', async (done) => {
    const animes = await Anime.find({});
    const score = 3;
    authUtils
      .getUserToken()
      .then(token => {
        request(app)
          .post(`/animes/${animes[0]._id.toHexString()}/evaluations`)
          .set('authorization', `Bearer ${token}`)
          .send({
            score,
          })
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.eql('OK');
            expect(res.message).to.eql('OK');
            expect(res).to.have.property('content');
            expect(res.content).to.have.property('evaluation');
            expect(res.content.evaluation).to.have.property('score');
            expect(res.content.evaluation.score).to.eql(score);
            done();
          });
      });
  });

  test('Get evaluations', async (done) => {
    const animes = await Anime.find({});
    const evaluations = await Evaluation.find({ evaluatedObject: animes[0]._id.toHexString() });

    request(app)
      .get(`/animes/${animes[0]._id.toHexString()}/evaluations`)
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('OK');
        expect(res.message).to.eql('OK');
        expect(res).to.have.property('content');
        expect(res.content).to.have.property('evaluations');
        expect(res.content.evaluations.length).to.eql(evaluations.length);
        done();
      });

  });
});