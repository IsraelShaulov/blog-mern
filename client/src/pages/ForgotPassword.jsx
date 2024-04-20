import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Label, TextInput, Alert, Spinner } from 'flowbite-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      setLoading(true);
      const response = await axios.post('/api/v1/users/forgot-password', {
        email,
      });
      setLoading(false);
      // pass email as state
      navigate('/verify', { state: { email } });
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6'>
        <div className='flex-1'>
          <Link to='/' className=' font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg text-white'>
              Forgot
            </span>
            Password
          </Link>
          <p className='text-sm mt-5'>
            Please enter the email address that you used to login, and we will
            send you a OTP code to reset your password via Email.
          </p>
        </div>
        {/* right side */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleRequestOTP}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
