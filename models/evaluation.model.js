
module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const EvaluationSchema = new Schema({
    score: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    evaluatedObject: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  });

  EvaluationSchema.methods.toJSON = function() {
    const evaluation = this;

    return {
      id: evaluation._id,
      score: evaluation.score,
    };
  };

  EvaluationSchema.statics.getRateOfEvaluations = function (id) {

    const Evaluation = this;

    return new Promise((resolve, reject) => {
      Evaluation
        .aggregate([
          {
            $match: {
              evaluatedObject: id,
            },
          },
          {
            $group: {
              _id: null,
              sum: {
                $sum: "$score",
              },
              count: {
                $sum: 1,
              },
            },
          }
        ], (err, result) => {
          if (result.length === 0) {
            return resolve(0);
          } else {
            return resolve(1.0 * result[0].sum / result[0].count);
          }
        });
    });
  };

  EvaluationSchema.index({
    evaluatedObject: 1,
    user: 1
  }, {
    unique: true
  });

  db.model('Evaluation', EvaluationSchema);
};
