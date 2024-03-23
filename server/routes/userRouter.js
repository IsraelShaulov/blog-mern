import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateUser, getUserProfile);

export default router;
