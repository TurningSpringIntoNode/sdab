const User = require('../models/user.model');
const Account = require('../models/account');

const signupSocial = (req, res) => {

  const { user } = req;

  User
    .findOne({ email: user.email })
    .then(async (dbUser) => {
      if (dbUser) {
        return res
          .status(400)
          .send({
            status: 'ERROR',
            message: 'User already exists'
          });
      }

      const account = new Account({});

      await account.save();

      user.roles.account = account._id;

      user
        .save()
        .then(dbUser => {
          const token = dbUser
            .generateAuthToken()
          res
            .send({
              status: 'OK',
              message: 'OK',
              content: {
                token
              }
            });
        });
    });
};

const loginSocial = (req, res) => {
  const { authInfo } = req;
  const { email, password } = authInfo;
  User
    .findOne({ email })
    .then(dbUser => {
      if (!dbUser) {
        return res
          .status(400)
          .send({
            status: 'ERROR',
            message: 'User not found'
          });
      }
      User
        .validatePassword(password, dbUser.password)
        .then(same => {
          console.log(same);
          if (same) {
            const token = dbUser.generateAuthToken();
            res
              .send({
                status: 'OK',
                message: 'OK',
                content: {
                  token
                }
              });
          } else {
            return Promise.reject();
          }
        })
        .catch(() => {
          res
            .status(400)
            .send({
              status: 'ERROR',
              message: 'Incorrect password'
            });
        });
    });
};

module.exports = {
  signupSocial,
  loginSocial
}