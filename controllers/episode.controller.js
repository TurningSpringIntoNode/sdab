const { Episode } = require('../core/mongodb').mongoose.models;


const getEpisodes = (req, res) => {

  const { anime_id } = req.params;

  Episode
    .find({
      anime: anime_id
    })
    .then(episodes => {
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


const createEpisode = (req, res) => {

  const video = {
    id: req.file.public_id,
    url: req.file.url,
  };

  const {
    name, chapter, description,
  } = req.body;

  const {
    anime_id
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
        })
    });
};

module.exports = {
  getEpisodes,
  createEpisode,
  deleteEpisode,
};
