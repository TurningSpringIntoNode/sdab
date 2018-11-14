const { Episode } = require('../core/mongodb').mongoose.models;


const getEpisodes = (req, res) => {
  const { anime_id } = req.params;

  Episode
    .find({
      anime: anime_id,
    })
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
  const { anime_id, id } = req.params;

  Episode
    .find({
      anime: anime_id,
      _id: id,
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


const createEpisode = (req, res) => {
  const video = {
    id: req.file.public_id,
    url: req.file.url,
  };

  const {
    name, chapter, description,
  } = req.body;

  const {
    anime_id,
  } = req.params;

  const episode = new Episode({
    name,
    chapter,
    description,
    anime: anime_id,
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
  const { anime_id, id } = req.params;

  Episode
    .find({
      anime: anime_id,
      _id: id,
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
    })
    .catch(() => {
      res
        .send({
          status: 'ERROR',
          message: 'Internal server error',
        });
    });
};

const deleteEpisode = (req, res) => {
  const { anime_id, id } = req.params;

  Episode
    .deleteOne({
      _id: id,
      anime: anime_id,
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
