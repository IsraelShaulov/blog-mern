import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  logoutUser,
  getAllUsers,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../controllers/userController.js';
import {
  adminMiddleware,
  authenticateUser,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateUser, getUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/profile/logout', logoutUser);
router.get(
  '/profile/get-all-users',
  authenticateUser,
  adminMiddleware,
  getAllUsers
);
router.patch('/profile/:userId', authenticateUser, updateUserProfile);
router.delete('/profile/:userId', authenticateUser, deleteUserProfile);

export default router;
