import { errorHandler } from '../errors/error.js';
import User from '../models/UserModel.js';
import { attachCookies } from '../utils/attachCookies.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { createJWT } from '../utils/tokenUtils.js';

// @desc Register user
// @route POST /api/v1/users/register
// @access Public
export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
    // return res.status(400).json({ message: 'All fields are required' });
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return next(errorHandler(400, 'Email already exists'));
  }

  const usernameAlreadyExists = await User.findOne({ username });
  if (usernameAlreadyExists) {
    return next(errorHandler(400, 'Username already exists'));
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json('user created');
};

// @desc Login user & get token
// @route POST /api/v1/users/login
// @access Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const validUser = await User.findOne({ email });
  if (!validUser) {
    return next(errorHandler(404, 'Invalid Credentials'));
  }

  const isPasswordCorrect = await comparePassword(password, validUser.password);
  if (!isPasswordCorrect) {
    return next(errorHandler(401, 'Invalid Credentials'));
  }

  // create jwt
  const token = createJWT({ userId: validUser._id });
  // create cookie
  attachCookies({ res, token });

  validUser.password = undefined;

  res.status(200).json(validUser);
};

export const googleLogin = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  const user = await User.findOne({ email });

  // Check if user already exists
  if (user) {
    // create jwt
    const token = createJWT({ userId: user._id });
    // create cookie
    attachCookies({ res, token });
    user.password = undefined;
    return res.status(200).json(user);
  }
  // user not exits, we create new user
  else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(generatedPassword);

    const newUser = new User({
      username:
        name.toLowerCase().split(' ').join('') +
        Math.random().toString(9).slice(-4),
      email: email,
      password: hashedPassword,
      profilePicture: googlePhotoUrl,
    });
    await newUser.save();

    // create jwt
    const token = createJWT({ userId: newUser._id });
    // create cookie
    attachCookies({ res, token });
    newUser.password = undefined;
    return res.status(201).json(newUser);
  }
};
