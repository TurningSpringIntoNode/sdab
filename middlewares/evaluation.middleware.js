const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const parseEvaluationData = (req, res, next) => {
  const { score } = req.body;

  if (score && !Number.isNaN(score) && score >= 1 && score <= 5) {
    next();
  } else {
    responseWriter.badResponse(res, 400, constants.BAD_SCORE_FOR_EVALUATION);
  }
};

const parseEvaluatedObject = field => (req, res, next) => {
  const evaluatedObject = req.params[field];
  if (evaluatedObject) {
    req.evaluatedObject = evaluatedObject;
    next();
  } else {
    responseWriter.badResponse(res, 400, constants.ERROR);
  }
};

module.exports = {
  parseEvaluatedObject,
  parseEvaluationData,
};
