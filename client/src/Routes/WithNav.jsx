import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Navigate, NavLink } from "react-router-dom";
import { Outlet } from "react-router";
import { Icon } from "@iconify/react";

////howler for playing song
import { Howl, Howler } from "howler";

////

import Sidebar from "../components/shared/Sidebar.jsx";
import Navbar from "../components/Nav/Navbar.jsx";

import img from "../assets/images/stereo.jpg";
import { SongContext } from "../context/SongContext.jsx";

//////==========modals=======//////
import CreatePlaylistModal from "../components/modals/CreatePlaylistModal.jsx";
import Dropdown from "../components/Nav/Dropdown.jsx";
import ProfileEditModal from "../components/modals/ProfileEditModal.jsx";

function WithNav() {
  const { isAuthenticated } = useContext(AuthContext);
  const {
    currentSong,
    setCurrentSong,
    soundPlayed,
    setSoundPlayed,
    isPaused,
    setIsPaused,
  } = useContext(SongContext);

  useEffect(() => {
    if (!currentSong) return;
    // console.log("here");
    changeSong(currentSong.track);
  }, [currentSong]);

  const playSound = () => {
    if (!soundPlayed) {
      return;
    }
    soundPlayed.play();
  };

  const changeSong = (src) => {
    // console.log(soundPlayed);
    if (soundPlayed) {
      soundPlayed.stop();
    }
    // console.log("playing sound");
    var sound = new Howl({
      src: [src],
      html5: true,
    });

    setSoundPlayed(sound);

    sound.play();
    setIsPaused(false);
    // console.log(sound);
  };

  const pauseSound = () => {
    soundPlayed.pause();
  };

  const togglePause = () => {
    if (isPaused) {
      playSound(currentSong.track);
      setIsPaused(false);
    } else {
      pauseSound();
      setIsPaused(true);
    }
  };

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  return (
    <>
      <div className="h-[100vh] w-[100vw] overflow-x-hidden bg-darkgray flex flex-col flex-1">
        {showPlaylistModal && <CreatePlaylistModal />}
        {showProfileEditModal && <ProfileEditModal />}

        {/* {isAuthenticated ? "" : <AuthRoute />} */}
        <div
          className={`${
            currentSong ? "h-8/9" : "h-full"
          } w-full flex bg-black relative`}
        >
          {/* for sidebar  */}
          <div className="leftpanel h-full w-[22rem] max-w-[22rem] bg-black text-white overflow-y-hidden flex flex-col flex-0 ">
            <Sidebar auth={isAuthenticated} />
          </div>

          <div
            className="flex flex-1 py-2 pr-2 overflow-hidden text-white bg-black rounded-md rightpanel scroll-smooth"
            style={{ width: "calc(100% - 22.5rem)" }}
          >
            <div className="flex flex-1 overflow-hidden rounded-md bg-darkgray">
              <div
                className="fixed top-0 pt-2 bg-black right-2"
                style={{ width: "calc(100% - 22.5rem)" }}
              >
                <Navbar
                  auth={isAuthenticated}
                  setToggleDropdown={setToggleDropdown}
                />
              </div>
              {isAuthenticated && toggleDropdown && (
                <div className="absolute z-[999999] top-[4rem] right-8 shadow-primary-shadow rounded-sm overflow-hidden">
                  <Dropdown />
                </div>
              )}

              {/* ////for all routes  */}
              <div className="flex flex-1 w-full mt-16 Routes felx-col bg-darkgray hover:bg-opacity-20">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
        {currentSong && (
          <div
            className={`
            h-1/9 player bg-black flex items-center px-4 text-white`}
          >
            <div className="flex w-1/4">
              <img
                src={currentSong.thumbnail}
                alt=""
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex flex-col justify-center pl-4">
                <div className="font-spotify hover:underline">
                  {currentSong.name}
                </div>
                <div className="text-xs text-primarytext">
                  {currentSong.artist.name}
                </div>
              </div>
              <button className="pl-8 like">
                {true ? (
                  <Icon icon="mdi:heart-outline" className="w-5 h-5 " />
                ) : (
                  <Icon
                    icon="mdi:heart"
                    className="w-5 h-5 text-spotify_green"
                  />
                )}
              </button>
            </div>
            <div className="flex flex-col justify-center w-1/2 gap-2 py-4">
              <div className="flex items-center justify-center text-white gap-x-5 child:cursor-pointer">
                {/* controls */}
                <Icon
                  className="w-4 h-4 text-gray-400 hover:text-white"
                  icon="radix-icons:shuffle"
                />
                <Icon
                  className="w-6 h-6 text-gray-400 hover:text-white"
                  icon="iconoir:skip-prev-solid"
                />
                {isPaused ? (
                  <Icon
                    className="w-10 h-10 hover:scale-[1.1]"
                    icon="icon-park-solid:play"
                    onClick={togglePause}
                  />
                ) : (
                  <Icon
                    className="w-10 h-10 hover:scale-[1.1]"
                    icon="zondicons:pause-solid"
                    onClick={togglePause}
                  />
                )}
                <Icon
                  className="w-6 h-6 text-gray-400 hover:text-white"
                  icon="iconoir:skip-next-solid"
                />
                <Icon
                  className="w-4 h-4 text-gray-400 hover:text-white"
                  icon="ri:repeat-2-fill"
                />
              </div>
              <div className="w-full h-1 bg-white">{/* progress bar */}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WithNav;
