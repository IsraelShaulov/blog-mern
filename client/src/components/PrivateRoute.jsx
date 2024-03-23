import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'flowbite-react';

const PrivateRoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className='flex gap-2 min-h-screen justify-center align mt-40  '>
        <Spinner
          aria-label='Center-aligned spinner example'
          className='w-20 h-20'
        />
      </div>
    );
  }

  return currentUser ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
