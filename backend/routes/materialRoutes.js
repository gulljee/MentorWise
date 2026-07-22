const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { uploadMaterial, getMaterials } = require('../controllers/materialController');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mentorwise-uploads',
    allowed_formats: ['jpeg', 'png', 'jpg', 'pdf', 'docx', 'doc'], 
    resource_type: 'auto' // Important: required so Cloudinary properly handles non-image files like PDFs and Docs
  },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|docx|doc|jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        } else {
            cb('Error: Only PDF, Docx, and Images are allowed!');
        }
    }
});

router.post('/upload', protect, upload.single('file'), uploadMaterial);
router.get('/', protect, getMaterials);

module.exports = router;
