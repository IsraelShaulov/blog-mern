import { errorHandler } from '../errors/error.js';
import User from '../models/UserModel.js';

// @desc Get user profile
// @route GET /api/v1/users/profile
// @access Private
export const getUserProfile = async (req, res, next) => {
  const userProfile = await User.findById({ _id: req.user._id });
  if (!userProfile) {
    return next(errorHandler(404, 'User not found'));
  }
  res.status(200).json({
    _id: userProfile._id,
    username: userProfile.username,
    email: userProfile.email,
    profilePicture: userProfile.profilePicture,
    // isAdmin: userProfile.isAdmin,
  });
};
