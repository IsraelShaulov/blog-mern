import express from 'express';
import {
  adminMiddleware,
  authenticateUser,
} from '../middleware/authMiddleware.js';
import { createPost } from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', authenticateUser, adminMiddleware, createPost);

export default router;
