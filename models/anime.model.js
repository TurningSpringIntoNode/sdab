
module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const AnimeSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    thumb: {
      id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    resume: {
      type: String,
      required: true,
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
  });

  db.model('Anime', AnimeSchema);
};
