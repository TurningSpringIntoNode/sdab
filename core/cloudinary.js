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

const thumbParserMock = {
  single: () => {
    return (req, res, next) => {
      req.file = {
        url: req.body.thumb,
        public_id: req.body.thumb_id,
      };
      next();
    };
  },
};

const videoParserMock = {
  single: () => (req, res, next) => {
    req.file.url = req.body.video;
    req.file.public_id = req.body.video_id;
    next();
  },
};

module.exports = {
  cloudinary,
  thumbParser: process.env.NODE_ENV === 'test' ? thumbParserMock : thumbParser,
  videoParser: process.env.NODE_ENV === 'test' ? videoParserMock : videoParser,
};
