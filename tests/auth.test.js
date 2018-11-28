process.env.TEST_SUITE = 'auth';

const request = require('supertest');
const expect = require('chai').expect;

const config = require('../app.config');

const app = require('../app');

const { User, Account } = require('../core/mongodb').mongoose.models;

const authUtil = require('./utils/auth');

const user = {
  name: 'Felipe',
  email: 'ff@ff.com',
  password: 'lolo',
  checkPassword: 'lolo'
};

const admin = {
  name: 'Admin2',
  email: 'ad2@ff.com',
  password: 'lolo',
  checkPassword: 'lolo'
};

const userWrongCheck = {
  name: 'Felipe',
  email: 'ff@ff.com',
  password: 'lolo',
  checkPassword: 'lol'
};

describe('Auth', () => {

  test('Signup & login', (done) => {
    request(app)
      .post('/signup/social')
      .send(user)
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('OK');
        expect(res.content).to.have.property('token');
        request(app)
          .post('/login/social')
          .send({
            email: user.email,
            password: user.password
          })
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.deep.equal('OK');
            expect(res.content).to.have.property('token');
            expect(res.content).to.have.property('user');
            expect(res.content.user).to.have.property('role');
            expect(res.content.user.role).to.deep.equal('Account');
            done();
          });
      });
  });

  test('Signup with incorrect checkPasword', (done) => {
    request(app)
      .post('/signup/social')
      .send(userWrongCheck)
      .expect(400)
      .end(done);
  });

  test('Login as default admin', (done) => {
    request(app)
      .post('/login/social')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('OK');
        expect(res.content).to.have.property('token');
        expect(res.content).to.have.property('user');
        expect(res.content.user).to.have.property('role');
        expect(res.content.user.role).to.deep.equal('Admin');
        done();
      });
  });

  test('Wrong login', (done) => {
    request(app)
      .post('/login/social')
      .send({
        email: 'WW@gm.com',
        password: 'www',
      })
      .expect(400)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('ERROR');
        expect(res.message).to.deep.equal('User not found');
        done();
      });
  });

  test('Create admin', (done) => {
    request(app)
      .post('/login/social')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .then(res => res.body)
      .then(res => res.content.token)
      .then(token => {
        request(app)
          .post('/admin/')
          .set('authorization', 'Bearer ' + token)
          .send(admin)
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.deep.equal('OK');
            expect(res.content).to.have.property('token');
            expect(res.content).to.have.property('user');
            expect(res.content.user).to.have.property('role');
            expect(res.content.user.role).to.deep.equal('Admin');
            done();
          });
      });
  });

  test('delete admin', async (done) => {

    const adminDbUser = await User.findOne({ email: admin.email });

    authUtil
      .getAdminToken()
      .then(token => {
        request(app)
          .delete(`/admin/users/${adminDbUser._id}`)
          .set('authorization', `Bearer ${token}`)
          .send()
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.equal('OK');
            expect(res.message).to.equal('OK');
            done();
          });
      });
  });

  test('Invalid token request', (done) => {
    request(app)
      .post('/admin/')
      .set('authorization', 'Bearer 13143413413')
      .send({})
      .expect(401)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('ERROR');
        expect(res.message).to.deep.equal('Unauthorized user');
        done();
      })
  });

  test('Sign up already signed user', (done) => {
    request(app)
      .post('/signup/social')
      .send(user)
      .expect(400)
      .then(res => res.body)
      .then(res => {
          expect(res.status).to.deep.equal('ERROR');
          expect(res.message).to.deep.equal('User already exists');
          done();
      });
  });

  test('Login with wrong password', (done) => {
    request(app)
      .post('/login/social')
      .send({
        email: user.email,
        password: 'notfound'
      })
      .expect(401)
      .then(res => res.body)
      .then(res => {
          expect(res.status).to.deep.equal('ERROR');
          expect(res.message).to.deep.equal('Incorrect password');
          done();
      });
  });

  test('/me test', (done) => {
    const { email, password } = user;
    const authInfo = { email, password };
    request(app)
      .post('/login/social')
      .send(authInfo)
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('OK');
        expect(res.content).to.have.property('user');
        expect(res.content.user).to.have.property('role');
        expect(res.content.user.role).to.deep.equal('Account');
        expect(res.content).to.have.property('token');
        return res.content.token;
      })
      .then(token => {
        request(app)
          .get('/me')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .then(res => res.body)
          .then(res => {
            const { name, email} = user;
            expect(res.status).to.deep.equal('OK');
            expect(res.content).to.deep.equal({
              user: {
                name,
                email,
                role: 'Account',
              },
            });
            done();
          })
      });
  });

  test('delete user', (done) => {
    const { email, password } = user;
    const authInfo = { email, password };
    request(app)
      .post('/login/social')
      .send(authInfo)
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('OK');
        expect(res.content).to.have.property('user');
        expect(res.content.user).to.have.property('role');
        expect(res.content.user.role).to.deep.equal('Account');
        expect(res.content).to.have.property('token');
        return res.content.token;
      })
      .then(token => {
        request(app)
          .delete('/me')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.deep.equal('OK');
            User
              .findOne({ email })
              .exec((err, user) => {
                expect(err).to.be.a('null');
                expect(user).to.be.a('null');
                done();
              })
          });
      });
  });

  test('Admin delete user', async (done) => {
    const account = new Account({});
    await account.save();

    const {name, email, password} = user;
    const dbUser = new User({ name, email, password });
    dbUser.roles.Account = account._id;

    await dbUser.save();

    request(app)
      .post('/login/social')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.deep.equal('OK');
        expect(res.content).to.have.property('user');
        expect(res.content.user).to.have.property('role');
        expect(res.content.user.role).to.deep.equal('Admin');
        expect(res.content).to.have.property('token');
        return res.content.token;
      })
      .then(token => {
        request(app)
          .delete(`/admin/users/${dbUser._id}`)
          .set('authorization', `Bearer ${token}`)
          .expect(200)
          .then(res => res.body)
          .then(res => {
            expect(res.status).to.deep.equal('OK');
            User
              .findOne({ email })
              .exec((err, user) => {
                  expect(err).to.be.a('null');
                  expect(user).to.be.a('null');
                  done();
              });
          })
      });
  });

  test('Empty authorization', (done) => {
    request(app)
      .post('/animes')
      .send()
      .expect(401)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('ERROR');
        expect(res.message).to.eql('Unauthorized user');
        done();
      });
  });

  test('Invalid authorization', (done) => {
    request(app)
      .post('/animes')
      .set('authorization', '1111111111')
      .send()
      .expect(401)
      .then(res => res.body)
      .then(res => {
        expect(res.status).to.eql('ERROR');
        expect(res.message).to.eql('Unauthorized user');
        done();
      });
  });
});