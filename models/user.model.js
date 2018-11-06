const bcrypt = require('bcrypt');

const { jwtSign, jwtDecode, encryptPassword } = require('../utils/auth');

module.exports = (db, mongoose) => {
  const { Schema } = mongoose;

  const { Account } = db.models;
  const { Admin } = db.models;

  const Roles = {
    Account,
    Admin,
  };

  const UserSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
    },
    birth: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    roles: {
      Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
      },
      Account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
      },
    },
  });

  UserSchema.pre('save', function (next) {
    const user = this;
    encryptPassword(user.password)
      .then((encPassword) => {
        user.password = encPassword;
        next();
      });
  });

  UserSchema.methods.getRole = function () {
    const user = this;

    if (user.roles.Account) {
      return 'Account';
    } if (user.roles.Admin) {
      return 'Admin';
    }
    throw new Error('User without role');
  };

  UserSchema.methods.setupRole = async function (role) {
    const user = this;

    const roleInstance = new Roles[role]();
    await roleInstance.save();

    user.roles[role] = roleInstance._id;
  };

  UserSchema.methods.generateAuthToken = function () {
    const user = this;

    return jwtSign({
      id: user._id,
    });
  };

  UserSchema.statics.validatePassword = (password, hash) => new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, same) => {
      if (err) {
        reject(err);
      } else {
        resolve(same);
      }
    });
  });

  UserSchema.statics.findByToken = function (token) {
    const User = this;

    return new Promise((resolve, reject) => {
      jwtDecode(token)
        .then(({ id }) => {
          User
            .findById(id)
            .populate('roles.Admin')
            .populate('roles.Account')
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


  db.model('User', UserSchema);
};
