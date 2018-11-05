const User = require('../models/user.model');

const signupSocial = (req, res) => {

  const { user, role } = req;

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

      await role.save();

      user.roles.account = role._id;

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
                role: dbUser.getRole(),
                token
              }
            });
        });
    });
};

const signupSocialAdmin = (req, res) => {

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
          if (same) {
            const token = dbUser.generateAuthToken();
            res
              .send({
                status: 'OK',
                message: 'OK',
                content: {
                  role: dbUser.getRole(),
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