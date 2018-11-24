
module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const { Evaluation } = db.models;

  const AnimeSchema = new Schema({
    name: {
      type: String,
      unique: true,
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
  }, {
    timestamps: true,
  });

  AnimeSchema.methods.toJSONAsync = async function () {
    const anime = this;
    const score = await Evaluation
      .getRateOfEvaluations(anime._id);
    return {
      id: anime.id,
      name: anime.name,
      genre: anime.genre,
      thumb_url: anime.thumb.url,
      score,
      resume: anime.resume,
      updatedAt: anime.updateAt,
      createdAt: anime.createdAt,
    };
  };

  db.model('Anime', AnimeSchema);
};
