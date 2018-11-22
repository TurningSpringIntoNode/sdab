const { Comment } = require('../core/mongodb').mongoose.models;

const createComment = (req, res) => {

  const { message } = req.body;
  const { commentedAt } = req;

  const comment = new Comment({
    user: req.user._id,
    commentedAt,
    message,
  });

  comment
    .save()
    .then(comment => {
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            comment,
          },
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'OK',
          message: 'Internal server error',
        });
    });
};

const getComments = (req, res) => {

  const { commentedAt } = req;

  const query = {};

  if (commentedAt) {
    query.commentedAt = commentedAt;
  }

  Comment
    .find(query)
    .then(comments => {
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            comments,
          },
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'OK',
          message: 'Internal server error',
        });
    });
};

const updateComment = (req, res) => {

  const { commentId } = req.params;

  const { message } = req.body;

  Comment
    .findByIdAndUpdate(commentId, {
      $set: {
        message,
      },
    })
    .then(comment => {
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            comment,
          },
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'OK',
          message: 'Internal server error',
        });
    });
};

const deleteComment = (req, res) => {

  const { commentId } = req.params;

  Comment
    .findByIdAndDelete(commentId)
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
          status: 'OK',
          message: 'Internal server error',
        });
    });
};


module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};