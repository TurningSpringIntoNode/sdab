const bcrypt = require('bcrypt');

const { jwtSign, jwtDecode, hashPassword } = require('../utils/auth');

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
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      Admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
      },
      Account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
      },
    },
  });

  UserSchema.methods.hashPassword = function () {
    const user = this;
    return hashPassword(user.password)
      .then((hsPassword) => {
        user.password = hsPassword;
        return user;
      });
  };

  UserSchema.methods.getRole = function () {
    const user = this;

    if (user.roles.Account) {
      return 'Account';
    }
    if (user.roles.Admin) {
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

  UserSchema.methods.toJSON = function () {
    const user = this;
    return {
      name: user.name,
      email: user.email,
      role: user.getRole(),
    };
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

  UserSchema.statics.recDeleteById = function (id) {
    const User = this;

    return new Promise((resolve, reject) => {
      User
        .findById(id)
        .exec((err, user) => {
          if (err) {
            // TODO
            reject();
          } else if (user) {
            const deleteUserCb = (derr) => {
              if (derr) {
                reject(derr);
              } else {
                User
                  .deleteOne({ _id: id })
                  .exec((eerr) => {
                    if (eerr) {
                      reject(eerr);
                    } else {
                      resolve();
                    }
                  });
              }
            };
            if (user.roles.Admin) {
              Admin.deleteOne({ _id: user.roles.Admin }).exec(deleteUserCb);
            }
            if (user.roles.Account) {
              Account.deleteOne({ _id: user.roles.Account }).exec(deleteUserCb);
            }
          } else {
            resolve();
          }
        });
    });
  };


  db.model('User', UserSchema);
};
