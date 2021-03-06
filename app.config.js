module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sdab',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'sdabsdabdabdab',
  },
  admin: {
    name: process.env.ADMIN_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@admin.com',
    password: process.env.ADMIN_PASSWORD || 'admin',
    gender: process.env.ADMIN_GENDER || 'MALE',
  },
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    api: {
      key: process.env.CLOUDINARY_API_KEY,
      secret: process.env.CLOUDINARY_API_SECRET,
    },
  },
};
