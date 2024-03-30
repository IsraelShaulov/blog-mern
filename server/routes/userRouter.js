import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  logoutUser,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateUser, getUserProfile);
router.post('/profile/logout', logoutUser);
router.patch('/profile/:userId', authenticateUser, updateUserProfile);
router.delete('/profile/:userId', authenticateUser, deleteUserProfile);

export default router;
