import React from 'react';
import 'tailwindcss/tailwind.css';
import 'daisyui/dist/full.css';

const SideBar = () => {
  return (
    <div className="drawer lg:drawer-open h-full">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <div className="bg-base-200 min-h-screen w-56 p-4">
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
                  <li><a>Overview</a></li>
                  <li><a>Projects</a></li>
                  <li><a>Reports</a></li>
                </ul>
              </details>
            </li>
            <li><a>Account</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
