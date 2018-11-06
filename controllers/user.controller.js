const { User, Account, Admin } = require('../config/mongodb').mongoose.models;

const deleteOwnUser = (req, res) => {
  if (req.user.admin) {
    Admin.deleteOne({ '_id': req.user.roles.Admin });
  }
  if (req.user.account) {
    Account.deleteOne({ '_id': req.user.roles.Account });
  }
  User.deleteOne({ '_id': req.user._id });
};

module.exports = {
  deleteOwnUser
};