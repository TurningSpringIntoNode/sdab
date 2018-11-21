

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
  });

  db.model('Comment', CommentSchema);
};