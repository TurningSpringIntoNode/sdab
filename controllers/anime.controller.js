const { Anime, Episode } = require('../core/mongodb').mongoose.models;

const { cloudinary } = require('../core/cloudinary');

const getAnimes = (req, res) => {

  const { search } = req.query;

  const query = {};

  if (search) {
    query['name'] = new RegExp(search)
  }

  Anime
    .find(query)
    .then((animes) => {
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            animes,
          },
        });
    });
};

const getAnimeById = (req, res) => {
  const { animeId } = req.params;

  Anime
    .findById(animeId)
    .then((anime) => {
      if (anime) {
        res
          .send({
            status: 'OK',
            message: 'OK',
            content: {
              anime,
            },
          });
      } else {
        res
          .status(404)
          .send({
            status: 'ERROR',
            message: 'Anime not found',
          });
      }
    });
};

const createAnime = (req, res) => {
  const { name, genre, resume } = req.body;
  const { public_id, url } = req.file;

  const anime = new Anime({
    name,
    genre,
    resume,
    thumb: {
      id: public_id,
      url,
    },
  });

  anime
    .save()
    .then((animeDb) => {
      res.send({
        status: 'OK',
        message: 'OK',
        content: {
          anime: animeDb,
        },
      });
    });
};

const updateAnime = (req, res) => {
  const { animeId } = req.params;

  const { name, genre, resume } = req.body;
  const { public_id, url } = req.file;

  Anime
    .findById(animeId)
    .then((anime) => {
      if (anime) {
        anime.name = name;
        anime.gender = genre;
        anime.resume = resume;
        anime.thumb.url = url;
        anime.thumb.id = public_id;
        anime
          .save()
          .then((animeDb) => {
            res
              .send({
                status: 'OK',
                message: 'OK',
                content: {
                  anime: animeDb,
                },
              });
          });
      } else {
        res
          .status(404)
          .send({
            status: 'ERROR',
            message: 'Anime not found',
          });
      }
    });
};

const deleteAnime = (req, res) => {
  const { animeId } = req.params;

  Anime
    .findById(animeId)
    .then((animeDb) => {
      cloudinary.uploader.destroy(animeDb.thumb.id, () => {
        Anime
          .deleteOne({ _id: animeId })
          .then(() => {
            Episode
              .deleteManyByAnimeId(animeId)
              .then(() => {
                res
                  .send({
                    status: 'OK',
                    message: 'OK',
                  });
              });
          });
      });
    });
};

module.exports = {
  getAnimes,
  getAnimeById,
  createAnime,
  deleteAnime,
  updateAnime,
};
