const { Evaluation } = require('../core/mongodb').mongoose.models;

const responseWriter = require('../utils/response-writer');

const createEvaluation = (req, res) => {
  const { score } = req.body;
  const { evaluatedObject } = req;

  const evaluation = new Evaluation({
    score,
    evaluatedObject,
    user: req.user._id,
  });

  evaluation
    .save()
    .then((evaluationDb) => {
      responseWriter.goodResponse(res, {
        evaluation: evaluationDb,
      });
    })
    .catch(responseWriter.failedToComplete(res));
};

const getEvaluations = (req, res) => {
  const { evaluatedObject } = req;

  const query = {};

  if (evaluatedObject) {
    query.evalutedObject = evaluatedObject;
  }

  Evaluation
    .find(query, {}, req.pagination)
    .then((evaluations) => {
      responseWriter.goodResponse(res, {
        evaluations,
      });
    })
    .catch(responseWriter.failedToComplete(res));
};

const getEvaluationsOfUser = (req, res) => {
  const query = {
    user: req.user._id,
  };

  const { evaluatedObject } = req;

  if (evaluatedObject) {
    query.evaluatedObject = evaluatedObject;
  }

  Evaluation
    .find(query, {}, req.pagination)
    .then((evaluations) => {
      responseWriter.goodResponse(res, {
        evaluations,
      });
    })
    .catch(responseWriter.failedToComplete(res));
};

const updateEvaluation = (req, res) => {
  const { evaluationId } = req;
  const { score } = req.body;

  Evaluation
    .findOneAndUpdate({
      _id: evaluationId,
      user: req.user._id,
    }, {
      $set: {
        score,
      },
    })
    .then((evaluation) => {
      responseWriter.goodResponse(res, {
        evaluation,
      });
    })
    .catch(responseWriter.failedToComplete(res));
};

const deleteEvaluation = (req, res) => {
  const { evaluationId } = req;

  Evaluation
    .findByIdAndDelete(evaluationId)
    .then(() => {
      responseWriter.goodResponse(res, {});
    })
    .catch(responseWriter.failedToComplete(res));
};

module.exports = {
  createEvaluation,
  getEvaluations,
  getEvaluationsOfUser,
  updateEvaluation,
  deleteEvaluation,
};
