const { User } = require('../core/mongodb').mongoose.models;

const getUser = (req, res) => {
  res.send({
    status: 'OK',
    message: 'OK',
    content: {
      user: req.user,
    },
  });
};

const deleteOwnUser = (req, res) => {
  User
    .recDeleteById(req.user._id)
    .then(() => {
      res
        .send({
          status: 'OK',
          message: 'OK',
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
};

module.exports = {
  getUser,
  deleteOwnUser,
};
