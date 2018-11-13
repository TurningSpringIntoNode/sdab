const { User } = require('../core/mongodb').mongoose.models;

const signupSocial = (req, res) => {
  const { user, role } = req;

  User
    .findOne({ email: user.email })
    .then(async (dbUser) => {
      if (dbUser) {
        res
          .status(400)
          .send({
            status: 'ERROR',
            message: 'User already exists',
          });
      } else {
        await user.setupRole(role);

        user
          .hashPassword()
          .then(user => {
            user
              .save()
              .then((dbUser) => {
                const token = dbUser
                  .generateAuthToken();
                res
                  .send({
                    status: 'OK',
                    message: 'OK',
                    content: {
                      role: dbUser.getRole(),
                      token,
                    },
                  });
              });
          });
      }
    });
};


const loginSocial = (req, res) => {
  const { authInfo } = req;
  const { email, password } = authInfo;
  User
    .findOne({ email })
    .then((dbUser) => {
      if (!dbUser) {
        res
          .status(400)
          .send({
            status: 'ERROR',
            message: 'User not found',
          });
      } else {
        User
          .validatePassword(password, dbUser.password)
          .then((same) => {
            if (same) {
              const token = dbUser.generateAuthToken();
              res
                .send({
                  status: 'OK',
                  message: 'OK',
                  content: {
                    role: dbUser.getRole(),
                    token,
                  },
                });
            } else {
              return Promise.reject();
            }
          })
          .catch(() => {
            res
              .status(401)
              .send({
                status: 'ERROR',
                message: 'Incorrect password',
              });
          });
      }
    });
};

module.exports = {
  signupSocial,
  loginSocial,
};
