const { Anime, Episode, Comment } = require('../core/mongodb').mongoose.models;

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
  const { animeId } = req.params;

  Anime
    .findById(animeId)
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
    .then((animeDb) => {
      res.send({
        status: 'OK',
        message: 'OK',
        content: {
          anime: animeDb,
        },
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

const getComments = (req, res) => {
  const { animeId } = req.params;

  Anime
    .findById(animeId)
    .populate('comments')
    .then(animeDb => {
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            comments: animeDb.comments,
          },
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'Internval server error',
        });
    });
};


const addComment = async (req, res) => {
  const { animeId } = req.params;

  const { message } = req.body;

  const comment = await Comment.create(req.user._id, message);
  await Anime.findOneAndUpdate({ _id : animeId}, { $push: { comments: comment._id } });
  res
    .send({
      status: 'OK',
      message: 'OK',
      content: {
        comment
      },
    });
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;

  const { message } = req.body;

  const comment = await Comment.findById(commentId);

  if (comment) {

  } else {

  }
};

module.exports = {
  getAnimes,
  getAnimeById,
  createAnime,
  deleteAnime,
  updateAnime,
  getComments,
  addComment,
};
