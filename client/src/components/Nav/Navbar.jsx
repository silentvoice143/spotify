import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Authbtn from "./Authbtn";
import { useCookies } from "react-cookie";
import { CgProfile } from "react-icons/cg";
import { GoBell } from "react-icons/go";

import Dropdown from "./Dropdown";

function Navbar({ auth, setToggleDropdown }) {
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    // Use go to navigate forward by one step
    navigate(1);
  };
  return (
    <div className="navbar w-full bg-darkgray h-[4rem] rounded-t-md flex justify-between items-center px-4">
      <div className="flex gap-2">
        <button
          onClick={handleGoBack}
          className={` bg-black hover:bg-lightgray text-white p-1 rounded-full`}
        >
          <IoIosArrowBack className="w-[25px] h-[25px]" />
        </button>
        <button
          onClick={handleGoForward}
          className={`bg-black hover:bg-lightgray text-white p-1 rounded-full`}
        >
          <IoIosArrowForward className="w-[25px] h-[25px]" />
        </button>
      </div>
      {auth ? (
        <div className="flex items-center justify-center rightbtn">
          <button className="px-4 py-2 font-bold text-black bg-white rounded-full hover:scale-105">
            Explore Premium
          </button>
          <button className="px-4 py-2 font-bold bg-transparent rounded-full hover:scale-105">
            Install App
          </button>
          <Link
            to="/notification"
            className="inline-block p-2 mr-3 bg-black rounded-full hover:bg-lightgray"
          >
            <GoBell className="w-6 h-6" />
          </Link>
          <button
            onClick={() => {
              setToggleDropdown((prev) => !prev);
            }}
            className="inline-block p-1 mr-3 bg-black rounded-full hover:bg-lightgray"
          >
            {cookies.user ? (
              <div className="flex items-center justify-center w-8 h-8 text-2xl font-semibold align-middle bg-pink-400 rounded-full">
                {cookies.user.name[0]}
              </div>
            ) : (
              <CgProfile className="w-6 h-6" />
            )}
          </button>
        </div>
      ) : (
        <div className="authbtn">
          <Link to="/signup">
            <Authbtn whitebtn={false} width="120px" displayText={"Signup"} />
          </Link>
          <Link to="/login">
            <Authbtn whitebtn={true} width="120px" displayText={"Login"} />
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
