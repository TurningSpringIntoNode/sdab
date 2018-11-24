

module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const CommentSchema = new Schema({
    message: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    commentedObject: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  }, {
    timestamps: true,
  });

  CommentSchema.methods.toJSON = function () {
    const comment = this;

    return {
      id: comment._id,
      message: comment.message,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  };

  CommentSchema.statics.create = (userId, commentedAt, message) => {
    const Comment = this;

    const comment = new Comment({
      user: userId,
      message,
      commentedAt,
    });

    return comment.save();
  };

  db.model('Comment', CommentSchema);
};
