import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Label, TextInput, Alert, Spinner } from 'flowbite-react';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { email, otp } = location.state;
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/api/v1/users/reset-password', {
        email,
        password,
        otp,
      });
      setMessage('Password has been successfully reset.');
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setMessage('Failed to reset password.');
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6'>
        <div className='flex-1'>
          <h2 className='font-bold dark:text-white text-4xl'>
            Reset{' '}
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg text-white'>
              Password
            </span>
          </h2>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleResetPassword}>
            <div>
              <Label value='New Password' />
              <TextInput
                type='password'
                placeholder='Enter new password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label value='Confirm New Password' />
              <TextInput
                type='password'
                placeholder='Confirm new password'
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Resetting...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
          {message && (
            <Alert
              className='mt-5'
              color={
                message === 'Password has been successfully reset.'
                  ? 'success'
                  : 'failure'
              }
            >
              {message}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
