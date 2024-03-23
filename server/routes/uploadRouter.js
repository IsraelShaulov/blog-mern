import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();
import User from '../models/UserModel.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  filename(req, file, cb) {
    const fileName = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

function fileFilter(req, file, cb, next) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error('Only .jpg, .jpeg, .png, and .webp files are allowed!'),
      false
    );
  }
}

const upload = multer({ storage, fileFilter });

router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  const userId = req.body.userId;
  const filePath = `/${req.file.path.replace(/\\/g, '/')}`;

  // Choose the base URL based on the environment
  const baseURL =
    process.env.NODE_ENV === 'development'
      ? process.env.DEVELOPMENT_API_URL
      : process.env.PRODUCTION_API_URL;
  const fullImageUrl = `${baseURL}${filePath}`;

  await User.findByIdAndUpdate(userId, {
    profilePicture: fullImageUrl,
  });

  res.status(200).json({
    message: 'Image uploaded and user profile updated successfully',
    image: fullImageUrl,
  });
});

export default router;
