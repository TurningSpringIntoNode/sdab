const User = require('../models/user.model');
const Admin = require('../models/admin');
const config = require('../app.config');


(async () => {

  const admin = new Admin();

  await admin.save();

  const adminUser = new User({
    name: config.admin.name,
    email: config.admin.email,
    password: config.admin.password,
    birth: config.admin.birth,
    gender: config.admin.gender
  });

  adminUser.roles.admin = admin._id;

  await adminUser.save();
})();

