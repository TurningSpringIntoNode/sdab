const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const { jwtSign, jwtDecode } = require('../utils/auth');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
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

  return jwtSign({
    id: user._id
  });
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

UserSchema.statics.findByToken = function (token) {
  const User = this;

  return new Promise((resolve, reject) => {
    jwtDecode(token)
      .then(({id}) => {
        User
          .findById(id)
          .populate('roles.admin')
          .populate('roles.account')
          .exec((err, user) => {
            if (err) {
              return reject(err);
            }
            return resolve(user);
          });
      })
      .catch(() => {
        resolve(null);
      });
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
