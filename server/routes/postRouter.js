import express from 'express';
import {
  adminMiddleware,
  authenticateUser,
} from '../middleware/authMiddleware.js';
import {
  createPost,
  getAllPosts,
  deletePost,
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', authenticateUser, adminMiddleware, createPost);
router.get('/getallposts', getAllPosts);
router.delete(
  '/delete-post/:postId/:userId',
  authenticateUser,
  adminMiddleware,
  deletePost
);

export default router;
