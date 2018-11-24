const { Evaluation } = require('../core/mongodb').mongoose.models;

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
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            evaluation: evaluationDb,
          },
        });
    })
    .catch(() => {
      res
        .send({
          status: 'ERROR',
          message: 'Internal server error',
        });
    });
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
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            evaluations,
          },
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'Intervnal server error',
        });
    });
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
      res
        .send({
          status: 'OK',
          message: 'OK',
          content: {
            evaluations,
          },
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({
          status: 'ERROR',
          message: 'Intervnal server error',
        });
    });
};

const updateEvaluation = (req, res) => {

};

module.exports = {
  createEvaluation,
  getEvaluations,
  getEvaluationsOfUser,
};
