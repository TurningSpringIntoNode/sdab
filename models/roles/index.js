const AccountModel = require('./account.model');
const AdminModel = require('./admin.model');

module.exports = (db, mongoose) => {
  AccountModel(db, mongoose);
  AdminModel(db, mongoose);
};