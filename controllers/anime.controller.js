const { Anime } = require('../core/mongodb').mongoose.models;

const createAnime = (req, res) => {

  const { name, genre, resume } = req.body;
  const { public_id, url } = req.file;

  const anime = new Anime({
    name,
    genre,
    resume,
    thumb: {
      id: public_id,
      url
    }
  });

  anime
    .save()
    .then(() => {
      res.send({
        status: 'OK',
        message: 'OK',
        content: {
          url
        }
      })
    })
};

module.exports = {
  createAnime
};