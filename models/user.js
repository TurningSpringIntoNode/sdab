const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;

const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String
});

UserSchema.encryptPassword = (password, done) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return done(err);
    }
    bcrypt.hash(password, salt, done);
  });
};

UserSchema.validatePassword = (password, hash, done) => {
  bcrypt.compare(password, hash, done);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
