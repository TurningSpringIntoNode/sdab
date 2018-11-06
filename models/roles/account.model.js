module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const AccountSchema = new Schema({

  });

  db.model('Account', AccountSchema);
};