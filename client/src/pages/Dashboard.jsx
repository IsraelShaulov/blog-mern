import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardProfile from '../components/DashboardProfile';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardPosts from '../components/DashboardPosts';
import DashboardUsers from '../components/DashboardUsers';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashboardSidebar tab={tab} />
      </div>
      {/* profile */}
      {tab === 'profile' && <DashboardProfile />}
      {/* posts */}
      {tab === 'posts' && <DashboardPosts />}
      {/* users */}
      {tab === 'users' && <DashboardUsers />}
    </div>
  );
};
export default Dashboard;
