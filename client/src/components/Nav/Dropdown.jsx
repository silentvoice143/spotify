import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SongContext } from "../../context/SongContext";
import { toast } from "react-toastify";

function Dropdown() {
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
  return (
    <div className="w-[160px] bg-spotifybg  text-white">
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
