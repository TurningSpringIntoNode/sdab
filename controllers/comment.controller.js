const { Comment } = require('../core/mongodb').mongoose.models;

const responseWriter = require('../utils/response-writer');

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
    .catch(responseWriter.failedToComplete(res));
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
    .catch(responseWriter.failedToComplete(res));
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
    .catch(responseWriter.failedToComplete(res));
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
    .catch(responseWriter.failedToComplete(res));
};

const deleteComment = (req, res) => {
  const { commentId } = req.params;

  Comment
    .findByIdAndDelete(commentId)
    .then(() => {
      responseWriter.goodResponse(res, {});
    })
    .catch(responseWriter.failedToComplete(res));
};


module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentsOfUser,
};
