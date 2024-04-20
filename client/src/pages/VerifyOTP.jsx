import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Label, TextInput, Alert, Spinner } from 'flowbite-react';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state.email;

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/v1/users/verify-otp', {
        email,
        otp,
      });
      setMessage(response.data.message);
      setLoading(false);
      if (response.data.message === 'OTP verified successfully.') {
        navigate('/reset-pass', { state: { email: email, otp: otp } });
      }
    } catch (error) {
      setLoading(false);
      setMessage('OTP verification failed.');
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6'>
        <div className='flex-1'>
          <h2 className='font-bold dark:text-white text-4xl'>
            Verify
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg text-white'>
              OTP
            </span>
          </h2>
          <p>This code will expire in 5 minutes.</p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleVerifyOTP}>
            <div>
              <Label value='Enter your OTP' />
              <TextInput
                type='text'
                placeholder='Enter OTP'
                id='otp'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
                  <span className='pl-3'>Verifying...</span>
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </form>
          {message && (
            <Alert
              className='mt-5'
              color={
                message === 'OTP verified successfully.' ? 'success' : 'failure'
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

export default VerifyOTP;
