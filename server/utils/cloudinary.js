const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'code-repository',
    format: async (req, file) => {
      // Get file extension or default to 'txt'
      const ext = file.originalname.split('.').pop();
      return ext || 'txt';
    },
    public_id: (req, file) => {
      // Generate unique public ID
      return `codefile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    },
    resource_type: 'raw' // Important for code files
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file extensions
    const allowedExtensions = ['.js', '.py', '.java', '.cpp', '.c', '.html', '.css', '.php', '.rb', '.go', '.rs', '.ts', '.txt', '.md', '.json', '.xml', '.yml', '.yaml'];
    
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only code files are allowed.'), false);
    }
  }
});

module.exports = { cloudinary, upload };