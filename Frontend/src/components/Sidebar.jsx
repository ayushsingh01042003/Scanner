import React from 'react';
import { Link } from 'react-router-dom';
import { RiBookMarkedLine } from "react-icons/ri";
import { FaChartPie } from "react-icons/fa6";

const SideBar = () => {
  return (
    <div className="fixed h-full w-56 bg-[#1C1C1C] text-[#CCCCCC] p-4 border-r-[0.5px] border-white rounded-2xl">
      <div className="flex items-center mb-4">
        <div className="avatar placeholder">
          <div className="bg-[#a4ff9e] text-black rounded-full w-8">
            <span className="text-xs">UI</span>
          </div>
        </div>
        <span className="ml-2 text-[#CCCCCC]"style={{ fontSize: '1.05rem' }}>Username</span>
      </div>
      <ul className="menu p-2 w-full">
        <li>
          <details open>
            <summary className="cursor-pointer text-[#CCCCCC] hover:text-[#A8C5DA]"style={{ fontSize: '1.04rem' }}>User profile</summary>
            <ul className="ml-2 mt-2">
              <li>
                <Link to="/overview" className=" text-[#CCCCCC] hover:text-[#A8C5DA]"style={{ fontSize: '1.0rem' }}><FaChartPie size={21}/>Overview</Link>
              </li>
              <li>
                <Link to="/reports" className="text-[#CCCCCC] hover:text-[#A8C5DA]"style={{ fontSize: '1.0rem' }}><RiBookMarkedLine size={21} />Reports</Link>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
