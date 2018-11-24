const { Comment } = require('../core/mongodb').mongoose.models;

const createComment = (req, res) => {
  const { message } = req.body;
  const { commentedObject } = req;

  const comment = new Comment({
    user: req.user._id,
    commentedObject,
    message,
  });

  comment
    .save()
    .then((commentDb) => {
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            comment: commentDb,
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
  const { commentedObject } = req;

  const query = {};

  if (commentedObject) {
    query.commentedObject = commentedObject;
  }

  Comment
    .find(query, {}, req.pagination)
    .then((comments) => {
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

const getCommentsOfUser = (req, res) => {
  const query = {
    user: req.user._id,
  };

  const { commentedObject } = req;

  if (commentedObject) {
    query.commentedObject = commentedObject;
  }

  Comment
    .find(query, {}, req.pagination)
    .then((comments) => {
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
    .findOneAndUpdate({
      _id: commentId,
      user: req.user._id,
    }, {
      $set: {
        message,
      },
    })
    .then((comment) => {
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
  getCommentsOfUser,
};
