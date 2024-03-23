import { Button, TextInput } from 'flowbite-react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateProfileImageSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFileUrl, setImageFileUrl] = useState('');
  const filePickerRef = useRef();
  const dispatch = useDispatch();

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

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
        />
        <TextInput type='password' id='password' placeholder='password' />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Logout</span>
      </div>
    </div>
  );
};
export default DashboardProfile;
