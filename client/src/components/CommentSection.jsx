import { Alert, Button, Modal, TextInput, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [commentsArray, setCommentsArray] = useState([]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const response = await axios.post('/api/v1/comment/create-comment', {
        content: comment,
        postId: postId,
        userId: currentUser._id,
      });
      const data = response.data;
      setComment('');
      setCommentError(null);
      setCommentsArray([data, ...commentsArray]);
    } catch (error) {
      console.log(error);
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(
          `/api/v1/comment/get-posts-comments/${postId}`
        );
        const data = response.data;
        setCommentsArray(data);
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [postId]);

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Login as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser.profilePicture}
          />
          <Link
            to='/dashboard?tab=profile'
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be logged in to comment.
          <Link className='text-blue-500 hover:underline' to='/login'>
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleCommentSubmit}
          className='border border-teal-500 rounded-md p-3'
        >
          <Textarea
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {commentsArray.lenth === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-2'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{commentsArray.length}</p>
            </div>
          </div>
          {commentsArray.map((comment) => {
            return <Comment key={comment._id} comment={comment} />;
          })}
        </>
      )}
    </div>
  );
};
export default CommentSection;
