const UserModel = require('./user.model');
const RolesModel = require('./roles');
const AnimeModel = require('./anime.model');
const EpisodeModel = require('./episode.model');
const CommentModel = require('./comment.model');
const EvaluationModel = require('./evaluation.model');

module.exports = (db, mongoose) => {
  RolesModel(db, mongoose);
  UserModel(db, mongoose);
  EvaluationModel(db, mongoose);
  CommentModel(db, mongoose);
  AnimeModel(db, mongoose);
  EpisodeModel(db, mongoose);
};
