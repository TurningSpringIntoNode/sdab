const { Episode } = require('../core/mongodb').mongoose.models;

const createEpisode = (req, res) => {

  console.log('aq');

  const video = {
    id: req.file.public_id,
    url: req.file.url,
  };

  const { name, chapter, description, anime } = req.body;

  const episode = new Episode({
    name,
    chapter,
    description,
    anime,
    video,
  });

  episode
    .save()
    .then(episodeDb => {
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            episode: episodeDb
          },
        });
    });
};

module.exports = {
  createEpisode
};

