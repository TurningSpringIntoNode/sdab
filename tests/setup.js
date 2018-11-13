

beforeAll((done) => {
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