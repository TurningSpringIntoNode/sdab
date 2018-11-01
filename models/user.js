const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const { jwtSign } = require('../utils/auth');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: String,
  roles: {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin' 
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    }
  }
});

UserSchema.methods.generateAuthToken = function () {
  const user = this;

  return Promise.resolve(jwtSign({
    id: user._id
  }));
};

UserSchema.statics.encryptPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  });
};

UserSchema.statics.validatePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
