import React, { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SongContext } from "../../context/SongContext";
import { toast } from "react-toastify";

function Dropdown({ setToggleDropdown }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { soundPlayed, setCurrentSong, setSoundPlayed } =
    useContext(SongContext);
  const Logout = async () => {
    if (soundPlayed) {
      soundPlayed.stop();
    }
    setSoundPlayed(null);
    setCurrentSong(null);

    logout();
    navigate("/");
    toast.success("User logout successfully!!");
  };

  //to handle outside click

  const optionsBoxRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the clicked element is outside the box
      if (!optionsBoxRef.current.contains(event.target)) {
        // Handle the event (e.g., hide the box)
        // Your logic here to hide the box

        setToggleDropdown(false);
      }
    };

    // Add click event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  return (
    <div ref={optionsBoxRef} className="w-[160px] bg-spotifybg  text-white">
      <ul className="p-1">
        <Link to="/profile">
          <li className="flex gap-2 px-4 py-2 justify-start items-center hover:bg-[#373737] cursor-default">
            Profile
          </li>
        </Link>
        <Link to="/profile">
          <li className="flex gap-2 px-4 py-2 justify-start items-center hover:bg-[#373737] cursor-default">
            Settings
          </li>
        </Link>
        <li
          onClick={Logout}
          className="flex gap-2 px-4 py-2 justify-start items-center hover:bg-[#373737] cursor-default border-t-[0.3px] border-lightgray"
        >
          Logout
        </li>
      </ul>
    </div>
  );
}

export default Dropdown;
