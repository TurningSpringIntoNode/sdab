const { User } = require('./mongodb').mongoose.models;
const { Admin } = require('./mongodb').mongoose.models;
const config = require('../app.config');

module.exports = async () => {
  const admin = new Admin();

  await admin.save();

  const adminUser = new User({
    name: config.admin.name,
    email: config.admin.email,
    password: config.admin.password,
    birth: config.admin.birth,
    gender: config.admin.gender,
  });

  adminUser.roles.Admin = admin._id;

  await adminUser.save();
};
