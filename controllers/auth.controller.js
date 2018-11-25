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
          .then(() => {
            user
              .save()
              .then((ndbUser) => {
                const token = ndbUser
                  .generateAuthToken();
                res
                  .send({
                    status: 'OK',
                    message: 'OK',
                    content: {
                      user: {
                        role: ndbUser.getRole(),
                      },
                      token,
                    },
                  });
              });
          })
          .catch(() => {
            res
              .status(500)
              .send({
                status: 'ERROR',
                message: 'ERROR',
              });
          });;
      }
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'ERROR',
        });
    });;
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
              return res
                .send({
                  status: 'OK',
                  message: 'OK',
                  content: {
                    user: {
                      role: dbUser.getRole(),
                    },
                    token,
                  },
                });
            }
            return Promise.reject();
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
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'ERROR',
        });
    });;
};

module.exports = {
  signupSocial,
  loginSocial,
};
