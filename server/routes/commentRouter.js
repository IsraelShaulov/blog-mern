import express from 'express';
import {
  adminMiddleware,
  authenticateUser,
} from '../middleware/authMiddleware.js';
import { createComment } from '../controllers/commentController.js';

const router = express.Router();

router.post('/create-comment', authenticateUser, createComment);

export default router;
