import { Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  updateUserFailure,
  updateProfileImageSuccess,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  logoutUserSuccess,
  logoutUserStart,
} from '../redux/user/userSlice';
import toast from 'react-hot-toast';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFileUrl, setImageFileUrl] = useState('');
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const uploadImageHandler = async (e) => {
    console.log('File selected');
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', currentUser._id);

      try {
        const response = await axios.post('/api/v1/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setImageFileUrl(response.data.image);
        dispatch(updateProfileImageSuccess(response.data.image));
        toast.success('Image Uploaded Successfully');
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Failed to upload image');
      }
    }
  };

  // const uploadImageHandler = async (e) => {
  //   console.log('File selected');
  //   const file = e.target.files[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('image', file);
  //     formData.append('userId', currentUser._id);

  //     // Wrap the axios call in a function that returns a promise
  //     const uploadPromise = axios.post('/api/v1/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     // Use toast.promise to automatically handle the promise states
  //     toast.promise(uploadPromise, {
  //       loading: 'Uploading image...',
  //       success: (data) => {
  //         setImageFileUrl(data.data.image);
  //         dispatch(updateProfileImageSuccess(data.data.image));
  //         return 'Image Uploaded Successfully';
  //       },
  //       error: 'Failed to upload image',
  //     });
  //   }
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error(`You didn't change anything`);
      return;
    }

    try {
      dispatch(updateUserStart());
      const response = await axios.patch(
        `/api/v1/users/profile/${currentUser._id}`,
        formData
      );
      const data = response.data;
      dispatch(updateUserSuccess(data));
      toast.success('User Profile Updated Successfully');
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const response = await axios.delete(
        `/api/v1/users/profile/${currentUser._id}`
      );
      dispatch(deleteUserSuccess(response.data));
      toast.success('User Profile Deleted Successfully');
    } catch (error) {
      dispatch(deleteUserFailure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logoutUserStart());
      const response = await axios.post(`/api/v1/users/profile/logout`);
      dispatch(logoutUserSuccess(response.data));
      navigate('/login');
      toast.success('Logging Out...');
    } catch (error) {
      dispatch(logoutUserFailure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          ref={filePickerRef}
          type='file'
          accept='image/*'
          onChange={uploadImageHandler}
          hidden
        />
        <div
          className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='avatar'
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
          />
        </div>
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleLogout} className='cursor-pointer'>
          Logout
        </span>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
        dismissible
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default DashboardProfile;
