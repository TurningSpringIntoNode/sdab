

const parseCommentData = (req, res, next) => {
  const { message } = req.body;

  if (message) {
    next();
  } else {
    res
      .status(400)
      .send({
        status: 'ERROR',
        message: `Comment can't be empty`,
      });
  }

};

const parseCommentedAt = (field) => {
  return (req, res, next) => {
    req.commentedAt = req.params[field];
    next();
  };
};

module.exports = {
  parseCommentData,
  parseCommentedAt,
};