
const parseEvaluationData = (req, res, next) => {

  const { score } = req.body;

  if (score && !isNaN(score) && score >= 1 && score <= 5) {
    next();
  } else {
    res
      .status(400)
      .send({
        status: 'ERROR',
        message: 'Undefined score or score out of range [1,5]',
      });
  }
};

const parseEvaluatedObject = (field) => {
  return (req, res, next) => {
    const evaluatedObject = req.params[field];
    if (evaluatedObject) {
      req.evaluatedObject = evaluatedObject;
      next();
    } else {
      res
        .status(400)
        .send({
          status: 'ERROR',
        });
    }
  };
};

module.exports = {
  parseEvaluatedObject,
  parseEvaluationData,
};