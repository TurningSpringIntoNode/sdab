const User = require('../models/user');

const signupSocial = async (req, res) => {
  const { email, password } = req.body;
  const encPassword = await User.encryptPassword(password);

  User
    .findOne({ email })
    .then(dbUser => {
      if (dbUser) {
        return res.sendStatus(400);
      }
      const user = new User({
        email,
        password: encPassword
      });
      user
        .save()
        .then(dbUser => {
          const token = dbUser
            .generateAuthToken()
          res
            .send({
              token
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
            error: {
              message: 'User not found'
            }
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
                token
              });
          } else {
            res
              .status(400)
              .send({
                error: {
                  message: 'Incorrect password'
                }
              });
          }
        })
        .catch(() => {
          res
            .status(400)
            .send({
              error: {
                message: 'Incorrect password'
              }
            });
        });
    });
};

module.exports = {
  signupSocial,
  loginSocial
}