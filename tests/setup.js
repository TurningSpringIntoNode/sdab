const rewire = require('rewire');
const animeRouter = rewire('../routes/anime.route');

beforeAll((done) => {
  animeRouter.__set__("thumbParser", {
    single: () => (req, res, next) => {
      console.log('here');
      req.file.url = req.body.thumb;
      req.file.public_id = req.body.thumb_id;
      next();
    }
  });
  // cloudinary.__set__("videoParser", {
  //   single: () => (req, res, next) => {
  //     req.file.url = req.body.video;
  //     req.file.public_id = req.body.video_id;
  //     next();
  //   }
  // });
  setTimeout(done, 2000);
});

beforeEach( async (done) => {
  // TODO:
  // for(const model in mongoose.connection.models) {
  //   await mongoose.connection.models[model].deleteMany({})
  // }
  // await require('../core/admin-setup')();
  done();
});

afterAll(async (done) => {
  done();
});