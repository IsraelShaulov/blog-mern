import express from 'express';
import {
  adminMiddleware,
  authenticateUser,
} from '../middleware/authMiddleware.js';
import {
  createComment,
  getPostComments,
} from '../controllers/commentController.js';

const router = express.Router();

router.post('/create-comment', authenticateUser, createComment);
router.get('/get-posts-comments/:postId', getPostComments);

export default router;
