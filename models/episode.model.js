const { cloudinary } = require('../core/cloudinary');

module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const { Evaluation } = db.models;

  const EpisodeSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    chapter: {
      type: Number,
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
  });

  EpisodeSchema.methods.toJSONAsync = async function () {
    const episode = this;
    const score = await Evaluation
      .getRateOfEvaluations(episode._id);
    return {
      id: episode._id,
      name: episode.name,
      chapter: episode.chapter,
      video_url: episode.video.url,
      description: episode.description,
      score,
    };
  };

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
