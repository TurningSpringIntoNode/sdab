process.env.TEST_SUITE = 'comment';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../app');

const { Anime, Comment } = require('../core/mongodb').mongoose.models;

const authUtils = require('./utils/auth');
const populators = require('./utils/populators');

beforeAll(async () => {
  await populators.populateAnime();
  await populators.populateEpisode();
  await populators.populateUser();
});

describe('Comment crud', () => {

  test('Create comment', async (done) => {
    const animes = await Anime.find({});
    const message = 'meh';
    authUtils
      .getUserToken()
      .then(token => {
        request(app)
          .post(`/animes/${animes[0]._id.toHexString()}/comments`)
          .set('authorization', `Bearer ${token}`)
          .send({
            message,
          })
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.eql('OK');
            expect(res.message).to.eql('OK');
            expect(res).to.have.property('content');
            expect(res.content).to.have.property('comment');
            expect(res.content.comment).to.have.property('message');
            expect(res.content.comment.message).to.eql(message);
            done();
          });
      });
  });

  test('Get comments', async (done) => {
    const comments = await Comment.find({});
    const animes = await Anime.find({});

    request(app)
      .get(`/animes/${animes[0]._id.toHexString()}/comments`)
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('OK');
        expect(res.message).to.eql('OK');
        expect(res).to.have.property('content');
        expect(res.content).to.have.property('comments');
        expect(res.content.comments.length).to.eql(comments.length);
        done();
      });

  });
});