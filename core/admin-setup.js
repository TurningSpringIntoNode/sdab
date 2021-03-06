const config = require('../app.config');

module.exports = async (mongoose) => {
  const { Admin, User } = mongoose.models;

  const admin = new Admin();

  await admin.save().catch();

  const adminUser = new User({
    name: config.admin.name,
    email: config.admin.email,
    password: config.admin.password,
    gender: config.admin.gender,
  });

  adminUser.roles.Admin = admin._id;

  await adminUser.hashPassword();

  try {
    await adminUser.save().catch();
  } catch (e) {
    console.log('Unable to save admin, maybe already exists');
  }
};
