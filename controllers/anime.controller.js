const { Anime, Episode } = require('../core/mongodb').mongoose.models;

const { cloudinary } = require('../core/cloudinary');

const getAnimes = (req, res) => {
  Anime
    .find({})
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
  const { id } = req.params;

  Anime
    .findById(id)
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
    .then(() => {
      res.send({
        status: 'OK',
        message: 'OK',
        content: {
          url,
        },
      });
    });
};

const updateAnime = (req, res) => {
  const { id } = req.params;

  const { name, genre, resume } = req.body;
  const { public_id, url } = req.file;

  Anime
    .findById(id)
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
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'Internal server error',
        });
    });
};

const deleteAnime = (req, res) => {
  const { id } = req.params;

  Anime
    .findById(id)
    .then((animeDb) => {
      cloudinary.uploader.destroy(animeDb.thumb.id, () => {
        Anime
          .deleteOne({ _id: id })
          .then(() => {
            Episode
              .deleteManyByAnimeId(id)
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
