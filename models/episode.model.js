const { cloudinary } = require('../core/cloudinary');

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
    video: {
      id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    anime: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Anime',
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
    },
  });

  EpisodeSchema.statics.deleteManyByAnimeId = function (id) {
    const Episode = this;

    return Episode
      .find({ anime: id })
      .then((episodes) => {
        const destroyEpisodePromises = episodes
          .map(episode => new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(episode.video.id, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }));
        return Promise
          .all(destroyEpisodePromises)
          .then(() => Episode
            .deleteMany({ anime: id }))
          .catch(() => {
            // TODO:
          });
      });
  };

  db.model('Episode', EpisodeSchema);
};
