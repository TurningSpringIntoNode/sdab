
module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const EvaluationSchema = new Schema({
    evaluation: {
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

  db.model('Evaluation', EvaluationSchema);
};