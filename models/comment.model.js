

module.exports = (db, mongoose) => {

  const { Schema } = mongoose;

  const CommentSchema = new Schema({
    message: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sentAt: {
      type: Date,
      required: true,
    },
    anime: {
      type: Schema.Types.ObjectId,
      ref: 'Anime',
    },
    episode: {
      type: Schema.Types.ObjectId,
      ref: 'Episode',
    },
  });

  db.model('Comment', CommentSchema);
};