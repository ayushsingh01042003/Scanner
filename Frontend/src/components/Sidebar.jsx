import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiBookMarkedLine } from 'react-icons/ri';
import { FaChartPie } from 'react-icons/fa6';
import { AuthContext } from '../Pages/Auth/AuthContext';

const SideBar = () => {
  const { logout, username } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to the login page or any other page after logout
  };

  return (
    <div className="fixed h-full w-56 bg-[#1C1C1C] text-[#CCCCCC] p-4 border-r-[0.5px] border-white rounded-2xl">
      <div className="flex items-center mb-4">
        <div className="avatar placeholder">
          <div className="bg-[#a4ff9e] text-black rounded-full w-8">
            <span className="text-xs">{username ? username[0].toUpperCase() : 'U'}</span>
          </div>
        </div>
        <span className="ml-2 text-[#CCCCCC]" style={{ fontSize: '1.05rem' }}>{username || 'Username'}</span>
      </div>
      <ul className="menu p-2 w-full">
        <li>
          <details open>
            <summary className="cursor-pointer text-[#CCCCCC] hover:text-[#A8C5DA]" style={{ fontSize: '1.04rem' }}>User profile</summary>
            <ul className="ml-2 mt-2">
              <li>
                <Link to="/home/overview" className="text-[#CCCCCC] hover:text-[#A8C5DA]" style={{ fontSize: '1.0rem' }}>
                  <FaChartPie size={21} /> Overview
                </Link>
              </li>
              <li>
                <Link to="/home/reports" className="text-[#CCCCCC] hover:text-[#A8C5DA]" style={{ fontSize: '1.0rem' }}>
                  <RiBookMarkedLine size={21} /> Reports
                </Link>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <button onClick={handleLogout} className="mt-4 text-[#CCCCCC] hover:text-[#A8C5DA] bg-transparent border-none cursor-pointer" style={{ fontSize: '1.0rem' }}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
