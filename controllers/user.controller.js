const { User, Account, Admin } = require('../config/mongodb').mongoose.models;

const deleteOwnUser = (req, res) => {
  User
    .recDeleteById(req.user._id)
    .then(() => {
      res
        .send({
          status: 'OK',
          message: 'OK',
        });
    });
};

module.exports = {
  deleteOwnUser,
};
