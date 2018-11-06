const UserModel = require('./user.model');
const RolesModel = require('./roles');

module.exports = (db, mongoose) => {
  RolesModel(db, mongoose);
  UserModel(db, mongoose);
};