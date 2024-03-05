/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext, useRef, useMemo } from "react";
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

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!currentSong) return;
    // console.log("here");
    changeSong(currentSong.track);
  }, [currentSong]);

  useEffect(() => {
    if (soundPlayed) {
      console.log("here");

      soundPlayed.on("play", () => {
        setIsPaused(false);
        requestAnimationFrame(updateCurrentTime);
      });
      soundPlayed.on("end", () => {
        setIsPaused(true);
      });
      soundPlayed.on("load", () => {
        setDuration(soundPlayed.duration());
      });
    }
  }, [soundPlayed]);

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

  const updateCurrentTime = () => {
    setCurrentTime(soundPlayed.seek());
    if (soundPlayed.playing()) {
      requestAnimationFrame(updateCurrentTime);
    }
  };

  const formatTime = (time) => {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
  };

  //for calculating progress of the song
  const calculateProgress = () => {
    let n = (currentTime / duration) * 100;
    return n;
  };

  //progress bag click handler

  const progressBarRef = useRef(null);

  const handleProgressBarClick = (e) => {
    const clickedPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBarRef.current.clientWidth;
    const clickedTime = (clickedPosition / progressBarWidth) * duration;
    soundPlayed.seek(clickedTime);
    setCurrentTime(clickedTime);
  };

  //memoize icons

  const icons = useMemo(() => {
    return {
      playpause: !isPaused ? (
        <Icon
          className="w-10 h-10 hover:scale-[1.1]"
          icon="zondicons:pause-solid"
        />
      ) : (
        <Icon
          className="w-10 h-10 hover:scale-[1.1]"
          icon="icon-park-solid:play"
        />
      ),
      next: (
        <Icon
          className="w-6 h-6 text-gray-400 hover:text-white"
          icon="iconoir:skip-next-solid"
        />
      ),
      prev: (
        <Icon
          className="w-6 h-6 text-gray-400 hover:text-white"
          icon="iconoir:skip-prev-solid"
        />
      ),
    };
  }, [isPaused]);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  const leftPanelRef = useRef(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(400);

  useEffect(() => {
    // Accessing width after component is mounted
    if (leftPanelRef.current) {
      const containerWidth = leftPanelRef.current.clientWidth;
      setLeftPanelWidth(containerWidth);
      console.log("Width of the container:", containerWidth);
    }
  }, []);

  return (
    <>
      <div className="h-[100vh] w-[100vw] overflow-x-auto bg-darkgray flex flex-col flex-1">
        {showPlaylistModal && <CreatePlaylistModal />}
        {showProfileEditModal && <ProfileEditModal />}

        {/* {isAuthenticated ? "" : <AuthRoute />} */}
        <div
          className={`${
            currentSong ? "h-8/9" : "h-full"
          } w-full flex bg-black relative`}
        >
          {/* for sidebar  */}
          <div
            ref={leftPanelRef}
            className={`leftpanel h-full  w-[${leftPanelWidth}px]  bg-black text-white overflow-y-hidden flex flex-col flex-0 `}
          >
            <Sidebar
              setLeftPanelWidth={setLeftPanelWidth}
              auth={isAuthenticated}
            />
          </div>

          <div
            className="relative rightpanel flex flex-1 py-2 pr-2 min-w-[600px] overflow-hidden text-white bg-black rounded-md  scroll-smooth"
            style={{
              width: `calc(100% - ${leftPanelWidth}px)`,
            }}
          >
            <div className="relative flex w-full overflow-hidden rounded-md bg-darkgray">
              <div
                // right-[${leftPanelWidth}px]
                className={`absolute top-0 min-w-[600px]  bg-black right-0 w-full`}
                // style={{
                //   width: `calc(100% - ${leftPanelWidth + 8}px)`,
                // }}
              >
                <Navbar
                  auth={isAuthenticated}
                  setToggleDropdown={setToggleDropdown}
                />
              </div>
              {isAuthenticated && toggleDropdown && (
                <div className="absolute z-[999999] top-[4rem] right-8 shadow-primary-shadow rounded-sm overflow-hidden">
                  <Dropdown setToggleDropdown={setToggleDropdown} />
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
                <button className="">{icons.prev}</button>
                <button onClick={togglePause} className="">
                  {icons.playpause}
                </button>
                <button className="">{icons.next}</button>
                <Icon
                  className="w-4 h-4 text-gray-400 hover:text-white"
                  icon="ri:repeat-2-fill"
                />
              </div>
              <div
                ref={progressBarRef}
                onClick={handleProgressBarClick}
                className="relative w-full h-1 bg-[#5f5f5f] cursor-pointer"
              >
                {/* progress bar */}
                <div className="absolute left-0 currenttime bottom-2">
                  {formatTime(currentTime)}
                </div>
                <div className="absolute right-0 duration bottom-2">
                  {formatTime(duration)}
                </div>
                <div
                  className="w-0 h-1 bg-white bar"
                  style={{ width: calculateProgress() + "%" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WithNav;
