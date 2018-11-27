const { User } = require('../core/mongodb').mongoose.models;

const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const getUser = (req, res) => {
  responseWriter.goodResponse(res, {
    user: req.user,
  });
};

const deleteOwnUser = (req, res) => {
  User
    .recDeleteById(req.user._id)
    .then(() => {
      responseWriter.goodResponse(res, {});
    })
    .catch(responseWriter.failedToComplete(res));
};

module.exports = {
  getUser,
  deleteOwnUser,
};
