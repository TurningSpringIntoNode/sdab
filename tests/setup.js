const rewire = require('rewire');
const cloudinary = rewire('../core/cloudinary.js');

beforeAll((done) => {
  cloudinary.__set__("thumbParser", () => (req, res, next) => {
    req.file.url = req.body.thumb;
    req.file.public_id = req.body.thumb_id;
    next();
  });
  cloudinary.__set__("videoParser", () => (req, res, next) => {
    req.file.url = req.body.video;
    req.file.public_id = req.body.video_id;
    next();
  });
  done();
});

beforeEach( async (done) => {
  // TODO:
  // for(const model in mongoose.connection.models) {
  //   await mongoose.connection.models[model].deleteMany({})
  // }
  done();
});

afterAll(async (done) => {
  done();
});