
module.exports = (db, mongoose) => {

  const { Schema } = mongoose;

  const EpisodeSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    chapter: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    anime: {
      type: Schema.Types.ObjectId,
      required: true,
    }
  });

  db.model('Episode', EpisodeSchema);
};