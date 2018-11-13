const config = require('../app.config');

module.exports = async (mongoose) => {
  const { Admin, User } = mongoose.models;

  const admin = new Admin();

  await admin.save().catch();

  const adminUser = new User({
    name: config.admin.name,
    email: config.admin.email,
    password: config.admin.password,
    birth: config.admin.birth,
    gender: config.admin.gender,
  });

  adminUser.roles.Admin = admin._id;

  await adminUser.hashPassword();

  await adminUser.save().catch();
};
