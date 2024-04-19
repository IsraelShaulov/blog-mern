import axios from 'axios';
import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DashboardUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`/api/v1/users/profile/get-all-users`);
        const data = response.data;
        setUsers(data.users);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchAllUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const response = await axios.get(
        `/api/v1/users/profile/get-all-users?startIndex=${startIndex}`
      );
      const data = response.data;
      setUsers((prevUsers) => {
        return [...prevUsers, ...data.users];
      });
      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      await axios.delete(`/api/v1/users/profile/${userIdToDelete}`);

      const newUsers = users.filter((user) => user._id !== userIdToDelete);
      setUsers(newUsers);
      setShowModal(false);
      toast.success('User deleted Successfully');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className='table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => {
              return (
                <Table.Body key={user._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>

                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className='w-10 h-10 rounded-full object-cover bg-gray-500'
                      />
                    </Table.Cell>

                    <Table.Cell>{user.username}</Table.Cell>

                    <Table.Cell>{user.email}</Table.Cell>

                    <Table.Cell>
                      {user.isAdmin ? (
                        <FaCheck className='text-green-500' />
                      ) : (
                        <FaTimes className='text-red-500' />
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}

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
              Are you sure you want delete this user?
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
export default DashboardUsers;
