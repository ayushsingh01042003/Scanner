import React from 'react';
import SideBar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen overflow-hidden bg-[#121212] text-[#E0E0E0]">
      <SideBar />
      <div className="flex-1 ml-56 flex">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;