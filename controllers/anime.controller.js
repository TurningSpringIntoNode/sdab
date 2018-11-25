const { Anime, Episode } = require('../core/mongodb').mongoose.models;

const { cloudinary } = require('../core/cloudinary');

const getAnimes = (req, res) => {
  const { search, genre } = req.query;
  const { sorting } = req;

  const query = {};

  if (search) {
    query.name = new RegExp(search, 'i');
  }

  if (genre) {
    query.genre = genre;
  }

  Anime
    .find(query, {}, req.pagination)
    .sort([[sorting.sortBy, sorting.order]])
    .then((animes) => {
      Promise
        .all(animes.map(anime => anime.toJSONAsync()))
        .then((animesJson) => {
          res
            .send({
              status: 'OK',
              message: 'OK',
              content: {
                animes: animesJson,
              },
            });
        });
    });
};

const getAnimeById = (req, res) => {
  const { animeId } = req.params;

  Anime
    .findById(animeId)
    .then((anime) => {
      if (anime) {
        anime
          .toJSONAsync()
          .then((animeJson) => {
            res
              .send({
                status: 'OK',
                message: 'OK',
                content: {
                  anime: animeJson,
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
      animeDb
        .toJSONAsync()
        .then((animeJson) => {
          res.send({
            status: 'OK',
            message: 'OK',
            content: {
              anime: animeJson,
            },
          });
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
            animeDb
              .toJSONAsync()
              .then((animeJson) => {
                res
                  .send({
                    status: 'OK',
                    message: 'OK',
                    content: {
                      anime: animeJson,
                    },
                  });
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

const getGenres = (req, res) => {

  Anime
    .distinct('genre')
    .exec((err, genres) => {
      if (err) {
        res
          .status(500)
          .send({
            status: 'ERROR',
            message: 'ERROR',
          });
      } else {
        res
          .send({
            status: 'OK',
            message: 'OK',
            content: {
              genres: genres.sort().slice(req.pagination.skip, req.pagination.skip + req.pagination.limit),
            },
          });
      }
    });
};

module.exports = {
  getAnimes,
  getAnimeById,
  createAnime,
  deleteAnime,
  updateAnime,
  getGenres,
};
