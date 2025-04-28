import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { logoutUser } from "../../store/userSlice";
import { toggleTheme } from "../../store/themeSlice";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.user);
  const [dropdown,setDropDown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`;

  const handleLogout = () => {
    axios.post(BASE_URL + "/api/auth/logout",{},{
      headers: {Authorization: `bearer ${token}`}
    })
    .then((res) => {
      dispatch(logoutUser());
      navigate("/");
      toast.success(res.data.message)
    })
    .catch((err) => {
      toast.error(err.response.data.message)
    })
  }

  return (
      <div className="w-[90%] lg:w-[85%] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="md:hidden relative">
              <RxHamburgerMenu size={25} onClick={()=> setDropDown(!dropdown)} />
              {dropdown && <ul className={`absolute font-medium text-gray-600 menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 border border-gray-600 shadow-sm dark:bg-gray-800 dark:text-white dark:border-white `}>
                <li>
                  <Link to="/" onClick={()=> setDropDown(false)} >Home</Link>
                  <Link to="/questions" onClick={()=> setDropDown(false)} >Questions</Link>
                  <Link to="/rooms" onClick={()=> setDropDown(false)} >Rooms</Link>
                </li>
              </ul>}
          </span>
          <Link to="/dashboard" className="text-base md:text-xl">
            Stack <strong className="text-orange-400">Wave</strong>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8 font-semibold">
          <NavLink to="/dashboard" className={getNavLinkClass}>
            HOME
          </NavLink>
          <NavLink to="/questions" className={getNavLinkClass}>
            QUESTIONS
          </NavLink>
          <NavLink to="/rooms" className={getNavLinkClass}>
            ROOMS
          </NavLink>
        </div>

        <div className="flex flex-row-reverse md:flex-row items-center md:gap-4">
          <input
            type="text"
            placeholder="Search"
            className={`hidden bg-transparent md:block input input-bordered w-28 md:w-96 dark:border dark:border-white`}
          />

            <div className={`dropdown dropdown-end dark:text-white`}>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full dark:bg-gray-700">
                  <img alt="profile photo" src={user.avatar} />
                </div>
              </div>

              <ul tabIndex={0} className={`menu bg-white menu-sm dropdown-content dark:bg-black "bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow`}>
                <li>
                  <Link to={`/profile/${user._id}`} className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <div onClick={handleLogout}> Logout </div>
                </li>
              </ul>
            </div>

          <div className="themeController mx-6">
            <label className="toggle text-base-content dark:border dark:border-white">
              <input
                type="checkbox"
                value="synthwave"
                className="theme-controller dark:bg-gray-400 dark:rounded-full"
                onChange={(e) => dispatch(toggleTheme())}
              />

              <svg
                aria-label="sun"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="10" cy="10" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </g>
              </svg>

              <svg
                aria-label="moon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </g>
              </svg>
            </label>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
