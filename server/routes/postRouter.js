import express from 'express';
import {
  adminMiddleware,
  authenticateUser,
} from '../middleware/authMiddleware.js';
import { createPost, getAllPosts } from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', authenticateUser, adminMiddleware, createPost);
router.get('/getallposts', getAllPosts);

export default router;
