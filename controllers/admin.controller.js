const { User } = require('../core/mongodb').mongoose.models;

const responseWriter = require('../utils/response-writer');

const deleteUserById = (req, res) => {
  const { id } = req.params;

  User
    .recDeleteById(id)
    .then(() => {
      responseWriter.goodResponse(res, {});
    })
    .catch(responseWriter.failedToComplete(res));
};

module.exports = {
  deleteUserById,
};
