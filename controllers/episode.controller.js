const { Episode } = require('../core/mongodb').mongoose.models;


const getEpisodes = (req, res) => {
  const { animeId } = req.params;
  const { sorting } = req;

  Episode
    .find({
      anime: animeId,
    }, {}, req.pagination)
    .sort([[sorting.sortBy, sorting.order]])
    .then((episodes) => {
      Promise
        .all(episodes.map(episode => episode.toJSONAsync()))
        .then((episodesJson) => {
          res
            .send({
              status: 'OK',
              message: 'OK',
              content: {
                episodes: episodesJson,
              },
            });
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'ERROR',
        });
    });;
};

const getEpisodeById = (req, res) => {
  const { animeId, episodeId } = req.params;

  Episode
    .findOne({
      anime: animeId,
      _id: episodeId,
    })
    .then((episode) => {
      if (episode) {
        episode
          .toJSONAsync()
          .then((episodeJson) => {
            res
              .send({
                status: 'OK',
                message: 'OK',
                content: {
                  episode: episodeJson,
                },
              });
          });
      } else {
        res
          .status(404)
          .send({
            status: 'ERROR',
            message: 'Episode not found',
          });
      }
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'ERROR',
        });
    });;
};


const createEpisode = (req, res) => {
  const video = {
    id: req.file.public_id,
    url: req.file.url,
  };

  const {
    name, chapter, description,
  } = req.body;

  const {
    animeId,
  } = req.params;

  const episode = new Episode({
    name,
    chapter,
    description,
    anime: animeId,
    video,
  });

  episode
    .save()
    .then((episodeDb) => {
      episodeDb
        .toJSONAsync()
        .then((episodeJson) => {
          res
            .send({
              status: 'OK',
              message: 'OK',
              content: {
                episode: episodeJson,
              },
            });
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'ERROR',
        });
    });;
};

const updateEpisode = (req, res) => {
  const { animeId, episodeId } = req.params;

  Episode
    .findOne({
      anime: animeId,
      _id: episodeId,
    })
    .then((episode) => {
      if (episode) {
        episode
          .toJSONAsync()
          .then((episodeJson) => {
            res
              .send({
                status: 'OK',
                message: 'OK',
                content: {
                  episode: episodeJson,
                },
              });
          });
      } else {
        res
          .send({
            status: 'ERROR',
            message: 'Episode not found',
          });
      }
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'ERROR',
        });
    });;
};

const deleteEpisode = (req, res) => {
  const { animeId, episodeId } = req.params;

  Episode
    .deleteOne({
      _id: episodeId,
      anime: animeId,
    })
    .then(() => {
      res
        .send({
          status: 'OK',
          message: 'OK',
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'ERROR',
        });
    });;
};

module.exports = {
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};
