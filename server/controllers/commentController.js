import { errorHandler } from '../errors/error.js';
import Comment from '../models/CommentModel.js';

// @desc Create single comment
// @route POST /api/v1/comment/create-comment
// @access Public
export const createComment = async (req, res, next) => {
  const { content, postId, userId } = req.body;

  if (req.user._id.toString() !== userId) {
    return next(
      errorHandler(403, 'You are not allowed to create this comment')
    );
  }

  const newComment = new Comment({
    content,
    postId,
    userId,
  });

  await newComment.save();
  const populatedComment = await Comment.findById(newComment._id).populate(
    'userId',
    'username profilePicture'
  );

  res.status(200).json(populatedComment);
};

// @desc Get Comments of the posts
// @route GET /api/v1/comment/get-posts-comments/:postId
// @access Public
export const getPostComments = async (req, res, next) => {
  const comments = await Comment.find({ postId: req.params.postId })
    .sort({
      createdAt: -1,
    })
    .populate('userId', 'username profilePicture createdAt');

  res.status(200).json(comments);
};
