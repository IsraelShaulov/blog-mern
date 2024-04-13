import { errorHandler } from '../errors/error.js';
import Post from '../models/PostModel.js';

// @desc create post
// @route POST /api/v1/post/create-post
// @access Admin
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

// @desc get all post
// @route GET /api/v1/post/getallposts
// @access Public
export const getAllPosts = async (req, res, next) => {
  // Pagination
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === 'asc' ? 1 : -1;

  // Search functionality
  const posts = await Post.find({
    ...(req.query.userId && { userId: req.query.userId }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.slug && { slug: req.query.slug }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { content: { $regex: req.query.searchTerm, $options: 'i' } },
      ],
    }),
  })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({
    totalPosts,
    lastMonthPosts,
    posts,
  });
};

// @desc delete single post
// @route DELETE /api/v1/post/delete-post
// @access Admin
export const deletePost = async (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }

  const deletePost = await Post.findByIdAndDelete(req.params.postId);
  if (!deletePost) {
    return next(errorHandler(404, 'Not found this post in db'));
  }
  res.status(200).json('The post has been deleted');
};

// @desc update single post
// @route PATCH /api/v1/post/update-post
// @access Admin
export const updatePost = async (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }

  const updatePost = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
    },
    { new: true }
  );

  if (!updatePost) {
    return next(errorHandler(404, 'Not found this post in db'));
  }
  res.status(200).json(updatePost);
};
