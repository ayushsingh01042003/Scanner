// SideBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import 'daisyui/dist/full.css';

const SideBar = () => {
  return (
    <div className="fixed h-full w-56 bg-base-200 p-4">
      <div className="flex items-center mb-4">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-8">
            <span className="text-xs">UI</span>
          </div>
        </div>
        <span className="ml-2">Username</span>
      </div>
      <ul className="menu p-2 w-full">
        <li>
          <details open>
            <summary>User Profile</summary>
            <ul>
              <li><Link to="/overview">Overview</Link></li>
              <li><Link to="/reports">Reports</Link></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
