const { User, Admin, Account } = require('../config/mongodb').mongoose.models;

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
  deleteUserById
};