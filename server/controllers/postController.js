import { errorHandler } from '../errors/error.js';
import Post from '../models/PostModel.js';

export const createPost = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  const titlePostAlreadyExists = await Post.findOne({ title: req.body.title });
  if (titlePostAlreadyExists) {
    return next(
      errorHandler(
        400,
        'This title post already exists, please write something else'
      )
    );
  }

  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user._id,
  });

  const savedPost = await newPost.save();
  res.status(201).json(savedPost);
};
