const UserModel = require('./user.model');
const RolesModel = require('./roles');
const AnimeModel = require('./anime.model');
const EpisodeModel = require('./episode.model');
const CommentModel = require('./comment.model');

module.exports = (db, mongoose) => {
  RolesModel(db, mongoose);
  UserModel(db, mongoose);
  AnimeModel(db, mongoose);
  EpisodeModel(db, mongoose);
  CommentModel(db, mongoose);
};
