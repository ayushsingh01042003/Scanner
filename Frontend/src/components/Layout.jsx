import React, { useContext } from 'react';
import SideBar from './Sidebar';
import SidebarTeam from './SidebarTeam';
import SidebarAdmin from './SidebarAdmin';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../Pages/Auth/AuthContext';

// const Layout = () => {
//   return (
//     <div className="flex min-h-screen overflow-hidden bg-[#121212] text-[#E0E0E0]">
//       <SidebarAdmin />
//       <div className="flex-1 ml-56 flex">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Layout;

const Layout = () => {
  const { accountType } = useContext(AuthContext);

  const renderSidebar = () => {
    switch (accountType) {
      case 'personal':
        return <SideBar />;
      case 'team':
        return <SidebarTeam />;
      case 'admin':
        return <SidebarAdmin />;
      default:
        return <SidebarAdmin />; // Default fallback
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#121212] text-[#E0E0E0]">
      {renderSidebar()}
      <div className="flex-1 ml-56 flex">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;