const { User } = require('../core/mongodb').mongoose.models;

const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const signupSocial = (req, res) => {
  const { user, role } = req;

  User
    .findOne({ email: user.email })
    .then(async (dbUser) => {
      if (dbUser) {
        return responseWriter.badResponse(res, 400, constants.USER_ALREADY_EXISTS);
      }
      await user.setupRole(role);

      return user
        .hashPassword()
        .then(() => {
          user
            .save()
            .then((ndbUser) => {
              const token = ndbUser
                .generateAuthToken();
              responseWriter.goodResponse(res, {
                user: {
                  role: ndbUser.getRole(),
                },
                token,
              });
            });
        });
    })
    .catch(responseWriter.failedToComplete(res));
};


const loginSocial = (req, res) => {
  const { authInfo } = req;
  const { email, password } = authInfo;
  User
    .findOne({ email })
    .then((dbUser) => {
      if (!dbUser) {
        return responseWriter.badResponse(res, 400, constants.USER_NOT_FOUND);
      }
      return User
        .validatePassword(password, dbUser.password)
        .then((same) => {
          if (same) {
            const token = dbUser.generateAuthToken();
            return responseWriter.goodResponse(res, {
              user: {
                role: dbUser.getRole(),
              },
              token,
            });
          }
          return Promise.reject();
        })
        .catch(() => {
          responseWriter.badResponse(res, 401, constants.INCORRECT_PASSWORD);
        });
    })
    .catch(responseWriter.failedToComplete(res));
};

module.exports = {
  signupSocial,
  loginSocial,
};
