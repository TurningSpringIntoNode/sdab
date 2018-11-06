const User = require('../config/mongodb').mongoose.models.User;
const Admin = require('../config/mongodb').mongoose.models.Admin;
const config = require('../app.config');

module.exports = async () => {

  const admin = new Admin();

  await admin.save();

  const adminUser = new User({
    name: config.admin.name,
    email: config.admin.email,
    password: config.admin.password,
    birth: config.admin.birth,
    gender: config.admin.gender
  });

  adminUser.roles.Admin = admin._id;

  await adminUser.save();
};

