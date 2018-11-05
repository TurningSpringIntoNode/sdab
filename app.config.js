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
    birth: process.env.ADMIN_BIRTH || '01/01/1901',
    gender: process.env.ADMIN_GENDER || 'MALE',
  }
};