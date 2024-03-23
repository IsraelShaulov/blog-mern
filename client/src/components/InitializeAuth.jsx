import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  loginStart,
  loginFailure,
  loginSuccess,
} from '../redux/user/userSlice';

const InitializeAuth = () => {
  const dispatch = useDispatch();

  const verifyUser = async () => {
    dispatch(loginStart());
    try {
      const response = await axios.get('/api/v1/users/profile');
      dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(loginFailure('Not authenticated'));
    }
  };

  useEffect(() => {
    verifyUser();
  }, [dispatch]);

  return null;
};

export default InitializeAuth;
