const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const parseCommentData = (req, res, next) => {
  const { message } = req.body;

  if (message) {
    next();
  } else {
    responseWriter.badResponse(res, 400, constants.COMMENT_NOT_EMPTY);
  }
};

const parseCommentedObject = field => (req, res, next) => {
  req.commentedObject = req.params[field];
  next();
};

module.exports = {
  parseCommentData,
  parseCommentedObject,
};
