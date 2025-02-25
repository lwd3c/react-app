import { useState } from "react";
import { FiX, FiMenu } from "react-icons/fi";
import { BiSolidDashboard, BiSolidVideos } from "react-icons/bi";
import { FaBook, FaAddressBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div>
      <button
        className="absolute top-4 left-4 z-50 p-2 bg-emerald-500  hover:bg-emerald-600 text-white rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-white w-64 transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-bold text-emerald-500 p-4 flex justify-center">
          SideBar
        </h2>
        <ul>
          <li
            className="mb-2 hover:bg-emerald-400 p-5 rounded cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <BiSolidDashboard size={20} className="inline mr-2" /> Dashboard
          </li>
          <li
            className="mb-2 hover:bg-emerald-400 p-5 rounded cursor-pointer"
            onClick={() => navigate("/topic")}
          >
            <FaBook size={20} className="inline mr-2" /> Topic
          </li>
          <li
            className="mb-2 hover:bg-emerald-400 p-5 rounded cursor-pointer"
            onClick={() => navigate("/channel")}
          >
            <FaAddressBook size={20} className="inline mr-2" /> Channel
          </li>
          <li
            className="mb-2 hover:bg-emerald-400 p-5 rounded cursor-pointer"
            onClick={() => navigate("/video")}
          >
            <BiSolidVideos size={20} className="inline mr-2" /> Video
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
