import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { FaMusic } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";

//
import { showErrorToast, showSuccessToast } from "../App/error/ShowToast";
import {
  makeAuthenticatedPOSTRequest,
  makeAuthenticatedGETRequest,
} from "../../utils/apiHelper";
import { PlaylistContext } from "../../context/PlaylistContext";
import { AuthContext } from "../../context/AuthContext";
import { useCookies } from "react-cookie";

function CreateOption() {
  const navigate = useNavigate();
  const { setPlaylistRefresh } = useContext(PlaylistContext);
  const { isAdmin, isAuthenticated } = useContext(AuthContext);

  /////=======//////
  const boxRef = useRef();
  const [showOptions, setShowOptions] = useState(false);

  const handleOptions = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the clicked element is outside the box
      if (!boxRef.current.contains(event.target)) {
        // Handle the event (e.g., hide the box)
        // Your logic here to hide the box

        setShowOptions(false);
      }
    };

    // Add click event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  ///////=================function for creating a playlist========================//////
  const createPlaylist = async () => {
    const route = "/playlist/create";
    const response = await makeAuthenticatedGETRequest(route);
    // console.log(response);
    if (response.error) {
      showErrorToast(response.error);
      return;
    } else {
      showSuccessToast("Playlist created Successfully");
    }
    const playlist = response.playList;

    const destPath = "/playlist/" + playlist._id;

    navigate(destPath);
    setPlaylistRefresh((prev) => !prev);
  };

  return (
    <div ref={boxRef}>
      <button onClick={handleOptions}>
        <Icon
          icon="ic:outline-plus"
          className="w-[30px] h-[30px] rounded-full hover:bg-lightgray"
        />
      </button>
      <div
        className="options absolute p-1 text-white 
         z-[99999] bg-lightgray rounded-md overflow-hidden"
        style={
          showOptions
            ? {
                display: "block",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                transform: "translate3d(4px, 6px, 0px)",
              }
            : { display: "none" }
        }
      >
        {/* //list of options / */}
        <ul className="p-1">
          {isAdmin && (
            <Link to="/uploadsong" className="">
              <li className="flex gap-2 px-4 py-2 justify-start items-center hover:bg-[#373737] cursor-default">
                <FaMusic />
                <p>Add a Song</p>
              </li>
            </Link>
          )}
          <Link className="">
            <li
              className="flex gap-2 px-4 py-2 justify-start items-center hover:bg-[#373737] cursor-default"
              onClick={createPlaylist}
            >
              <FaFolder />
              <p>Create a Playlist</p>
            </li>
          </Link>
          {/* <Link className="">
            <li
              className="flex gap-2 px-4 py-2 justify-start items-center hover:bg-[#373737] cursor-default"
              onClick={deletePlaylist}
            >
              <FaFolder />
              <p>Delete Playlist</p>
            </li>
          </Link> */}
        </ul>
      </div>
    </div>
  );
}

export default CreateOption;
