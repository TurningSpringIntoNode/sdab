const { User } = require('../core/mongodb').mongoose.models;

const deleteUserById = (req, res) => {
  const { id } = req.params;

  User
    .recDeleteById(id)
    .then(() => {
      res
        .send({
          status: 'OK',
          message: 'OK',
        });
    });
};

module.exports = {
  deleteUserById,
};
