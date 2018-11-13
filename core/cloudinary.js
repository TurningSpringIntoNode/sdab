const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

const config = require('../app.config');

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.api.key,
  api_secret: config.cloudinary.api.secret,
});

const thumbStorage = cloudinaryStorage({
  cloudinary,
  folder: 'thumbs',
  allowedFormats: ['jpg'],
  // TODO: setup transformation
});

const videoStorage = cloudinaryStorage({
  cloudinary,
  folder: 'videos',
  allowedFormats: ['mp4'],
  params: {
    resource_type: 'video',
  },
  // TODO: setup transformation
});

const thumbParser = multer({
  storage: thumbStorage,
});

const videoParser = multer({
  storage: videoStorage,
});

module.exports = {
  cloudinary,
  thumbParser,
  videoParser,
};
