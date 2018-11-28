const _ = require('lodash');

const { Anime, Episode } = require('../core/mongodb').mongoose.models;

const { cloudinary } = require('../core/cloudinary');

const responseWriter = require('../utils/response-writer');

const constants = require('../core/response-constants');

const getAnimes = (req, res) => {
  const { search, genre } = req.query;
  const { sorting } = req;

  const query = {};

  const safeSearch = _.escapeRegExp(search);

  if (safeSearch) {
    query.name = new RegExp(safeSearch, 'i');
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
          responseWriter.goodResponse(res, {
            animes: animesJson,
          });
        });
    })
    .catch(responseWriter.failedToComplete(res));
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
            responseWriter.goodResponse(res, {
              anime: animeJson,
            });
          });
      } else {
        responseWriter.badResponse(res, 404, constants.ANIME_NOT_FOUND);
      }
    })
    .catch(responseWriter.failedToComplete(res));
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
          responseWriter.goodResponse(res, {
            anime: animeJson,
          });
        });
    })
    .catch(responseWriter.failedToComplete(res));
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
        anime.genre = genre;
        anime.resume = resume;
        anime.thumb.url = url;
        anime.thumb.id = public_id;
        anime
          .save()
          .then((animeDb) => {
            animeDb
              .toJSONAsync()
              .then((animeJson) => {
                responseWriter.goodResponse(res, {
                  anime: animeJson,
                });
              });
          });
      } else {
        responseWriter.badResponse(res, 404, constants.ANIME_NOT_FOUND);
      }
    })
    .catch(responseWriter.failedToComplete(res));
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
                responseWriter.goodResponse(res, {});
              });
          });
      });
    })
    .catch(responseWriter.failedToComplete(res));
};

const getGenres = (req, res) => {
  let { search } = req.query;

  search = _.escapeRegExp(search);

  if (!search) {
    search = '';
  }

  Anime
    .aggregate([
      {
        $match: {
          genre: new RegExp(search, 'i'),
        },
      },
      {
        $sort: {
          genre: 1,
        },
      },
      {
        $group: {
          _id: null,
          genres: {
            $addToSet: '$genre',
          },
        },
      },
    ], (err, result) => {
      const { genres } = result[0];
      if (err) {
        responseWriter.failedToComplete(res);
      } else {
        responseWriter.goodResponse(res, {
          genres: genres.sort().slice(req.pagination.skip, req.pagination.skip + req.pagination.limit),
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
