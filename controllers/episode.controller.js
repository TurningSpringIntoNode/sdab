const { Episode } = require('../core/mongodb').mongoose.models;


const getEpisodes = (req, res) => {
  const { animeId } = req.params;

  Episode
    .find({
      anime: animeId,
    }, {}, req.pagination)
    .then((episodes) => {
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            episodes,
          },
        });
    });
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
        res
          .send({
            status: 'OK',
            message: 'OK',
            content: {
              episode,
            },
          });
      } else {
        res
          .status(404)
          .send({
            status: 'ERROR',
            message: 'Episode not found',
          });
      }
    });
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
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            episode: episodeDb,
          },
        });
    });
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
        res
          .send({
            status: 'OK',
            message: 'OK',
            content: {
              episode,
            },
          });
      } else {
        res
          .send({
            status: 'ERROR',
            message: 'Episode not found',
          });
      }
    });
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
    });
};

module.exports = {
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};
