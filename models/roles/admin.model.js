module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const AdminSchema = new Schema({

  });

  db.model('Admin', AdminSchema);
};
