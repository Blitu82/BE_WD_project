const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['tiff'],
    folder: 'bathy',
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    public_id: (req, file) => {
      // Extracting original filename without extension
      const filenameWithoutExtension = file.originalname
        .split('.')
        .slice(0, -1)
        .join('.');
      return filenameWithoutExtension; // Use the original filename as public_id
    },
  },
});

module.exports = multer({ storage });
