const { Anime, Episode } = require('../core/mongodb').mongoose.models;

const { cloudinary } = require('../core/cloudinary');

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

const deleteAnime = (req, res) => {

  const { id } = req.params;

  Anime
    .findById(id)
    .then(animeDb => {
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
                    message: 'OK'
                  });
              });
          });
      });
    })
};

module.exports = {
  createAnime,
  deleteAnime
};