
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
    },
    evaluatedObject: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  });

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

  db.model('Evaluation', EvaluationSchema);
};
