process.env.TEST_SUITE = 'auth';

const request = require('supertest');
const expect = require('chai').expect;

const config = require('../app.config');

const app = require('../app');

const { User, Account } = require('../config/mongodb').mongoose.models;

const user = {
  name: 'Felipe',
  email: 'ff@ff.com',
  gender: 'MALE',
  birth: '01/01/1901',
  password: 'lolo',
  checkPassword: 'lolo'
};

const admin = {
  name: 'Admin2',
  email: 'ad2@ff.com',
  gender: 'MALE',
  birth: '01/01/1901',
  password: 'lolo',
  checkPassword: 'lolo'
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
            expect(res.content.role).to.deep.equal('Account');
            done();
          });
      });
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
        expect(res.content.role).to.deep.equal('Admin');
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
            expect(res.content.role).to.deep.equal('Admin');
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
        expect(res.content.role).to.deep.equal('Account');
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
            const { name, email, gender, birth } = user;
            expect(res.status).to.deep.equal('OK');
            expect(res.content).to.deep.equal({
              name,
              email,
              birth: new Date(birth).toISOString(),
              gender,
              role: 'Account',
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
        expect(res.content.role).to.deep.equal('Account');
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

    const {name, email, gender, birth, password} = user;
    const dbUser = new User({ name, email, gender, birth, password });
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
        expect(res.content.role).to.deep.equal('Admin');
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
});