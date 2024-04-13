import { errorHandler } from '../errors/error.js';
import User from '../models/UserModel.js';
import { hashPassword } from '../utils/passwordUtils.js';

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
    isAdmin: userProfile.isAdmin,
  });
};

// @desc Update user profile
// @route Patch /api/v1/users/profile/:userId
// @access Private
export const updateUserProfile = async (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user!'));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    } else {
      req.body.password = hashPassword(req.body.password);
    }
  }

  if (req.body.username) {
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        // profilePicture: req.body.profilePicture,
        password: req.body.password,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    errorHandler(404, 'User not found');
  }
  updatedUser.password = undefined;

  res.status(200).json(updatedUser);
};

// @desc delete user profile
// @route DELETE /api/v1/users/profile/:userId
// @access Private
export const deleteUserProfile = async (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user!'));
  }

  const deleteUser = await User.findByIdAndDelete(req.params.userId);
  if (!deleteUser) {
    errorHandler(404, 'User not found');
  }

  res.status(200).json({ message: 'User deleted successfully' });
};

// @desc Logout user
// @route POST /api/v1/users/profile/logout
// @access Private
export const logoutUser = async (req, res, next) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: 'user logged out successfully' });
};

// @desc Get all users
// @route GET /api/v1/users/profile/get-all-users
// @access Private
export const getAllUsers = async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort === 'asc' ? 1 : -1;

  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalUsers = await User.countDocuments();

  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({ users, totalUsers, lastMonthUsers });
};
