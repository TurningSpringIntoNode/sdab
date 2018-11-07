const UserModel = require('./user.model');
const RolesModel = require('./roles');
const AnimeModel = require('./anime.model');

module.exports = (db, mongoose) => {
  RolesModel(db, mongoose);
  UserModel(db, mongoose);
  AnimeModel(db, mongoose);
};
