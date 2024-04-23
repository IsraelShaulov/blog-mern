import { errorHandler } from '../errors/error.js';
import Comment from '../models/CommentModel.js';

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

  res.status(200).json(newComment);
};
