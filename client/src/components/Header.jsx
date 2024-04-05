import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  TextInput,
  Spinner,
} from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import {
  logoutUserFailure,
  logoutUserStart,
  logoutUserSuccess,
} from '../redux/user/userSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

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
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg text-white'>
          Unbranded
        </span>
        Blog
      </Link>

      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        />
      </form>

      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>

      <div className='flex gap-2 md:order-2'>
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>

        {loading ? (
          <>
            <Spinner aria-label='Center-aligned spinner example' size='xl' />
          </>
        ) : currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' rounded img={currentUser.profilePicture} />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to='/dashboard?tab=profile'>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/login'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Login
            </Button>
          </Link>
        )}
        {/* Hamburger Menu */}
        <Navbar.Toggle />
        {/* End Hamburger Menu */}
      </div>

      <Navbar.Collapse>
        <Link to='/'>
          <Navbar.Link active={path === '/'} as={'div'}>
            Home
          </Navbar.Link>
        </Link>
        <Link to='/about'>
          <Navbar.Link active={path === '/about'} as={'div'}>
            About
          </Navbar.Link>
        </Link>
        <Link to='/projects'>
          <Navbar.Link active={path === '/projects'} as={'div'}>
            Projects
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Header;
