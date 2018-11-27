const { Comment } = require('../core/mongodb').mongoose.models;

const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

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
      responseWriter.goodResponse(res, {
        comment: commentDb,
      });
    })
    .catch(() => {
      responseWriter.badResponse(res, 500, constants.ERROR);
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
      responseWriter.goodResponse(res, {
        comments,
      });
    })
    .catch(() => {
      responseWriter.badResponse(res, 500, constants.ERROR);
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
      responseWriter.goodResponse(res, {
        comments,
      });
    })
    .catch(() => {
      responseWriter.badResponse(res, 500, constants.ERROR);
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
      responseWriter.goodResponse(res, {
        comment,
      });
    })
    .catch(() => {
      responseWriter.badResponse(res, 500, constants.ERROR);
    });
};

const deleteComment = (req, res) => {
  const { commentId } = req.params;

  Comment
    .findByIdAndDelete(commentId)
    .then(() => {
      responseWriter.goodResponse(res, {});
    })
    .catch(() => {
      responseWriter.badResponse(res, 500, constants.ERROR);
    });
};


module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentsOfUser,
};
