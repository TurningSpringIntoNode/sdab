const { User } = require('../core/mongodb').mongoose.models;

const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const deleteUserById = (req, res) => {
  const { id } = req.params;

  User
    .recDeleteById(id)
    .then(() => {
      responseWriter.goodResponse(res, {});
    })
    .catch(() => {
      responseWriter.badResponse(res, 500, constants.ERROR);
    });
};

module.exports = {
  deleteUserById,
};
