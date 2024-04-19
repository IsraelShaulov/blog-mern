import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import {
  logoutUserFailure,
  logoutUserStart,
  logoutUserSuccess,
} from '../redux/user/userSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const DashboardSidebar = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

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
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={props.tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser?.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={props.tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {currentUser?.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={props.tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            onClick={handleLogout}
            icon={HiArrowSmRight}
            className='cursor-pointer'
            labelColor='dark'
          >
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
export default DashboardSidebar;
