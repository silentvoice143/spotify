import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import IconText from "./IconText";

/////=====api======/////
import { makeAuthenticatedGETRequest } from "../../utils/apiHelper";

/////==========assets===========/////
import spotify_logo from "../../assets/logo.svg";
import "./style.css";

//////====components===========/////
import CreateOption from "./CreateOption";
import PlaylistListComponent from "../App/Playlist/PlaylistListComponent";
import { PlaylistContext } from "../../context/PlaylistContext";
import { AuthContext } from "../../context/AuthContext";
import { showSuccessToast } from "../App/error/ShowToast";

function Sidebar({ auth, setLeftPanelWidth }) {
  const { PlaylistData, setPlaylistRefresh } = useContext(PlaylistContext);
  const { isAdmin } = useContext(AuthContext);
  // console.log(PlaylistData);

  const [expand, setExpand] = useState(true);

  const navigate = useNavigate();

  ////============for creating first playlist============////

  const createPlaylist = async () => {
    if (!auth) {
      navigate("/login");
      return;
    }
    const route = "/playlist/create";
    const response = await makeAuthenticatedGETRequest(route);

    if (response.error) {
      alert("Something wrong!!!" + response.error);
      return;
    } else {
      showSuccessToast("Playlist created Successfully");
    }
    const playlist = response.playList;

    const destPath = "/playlist/" + playlist._id;
    // console.log(destPath);
    navigate(destPath);
    setPlaylistRefresh((prev) => !prev);
  };

  const sidebarIcons = useMemo(() => {
    return {
      expandIcon: expand ? (
        <Icon icon="fluent:library-20-filled" className="w-[30px] h-[30px]" />
      ) : (
        <Icon
          icon="fluent:library-16-regular"
          color="white"
          className="w-[30px] h-[30px]"
        />
      ),
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="py-2 m-2 mb-0 rounded-lg bg-darkgray text-primarytext h-fit">
        {expand && (
          <img src={spotify_logo} alt="" className="w-[120px] p-4 pl-5" />
        )}

        <NavLink to="/" className=" hover:text-white">
          <IconText
            iconName={"material-symbols:home"}
            displayText={expand ? "Home" : ""}
          />
        </NavLink>

        <NavLink to="/search" className={` hover:text-white`}>
          <IconText
            iconName={"mingcute:search-line"}
            displayText={expand ? "Search" : ""}
          />
        </NavLink>

        {isAdmin && (
          <NavLink to="/mymusic" className={` hover:text-white`}>
            <IconText
              iconName={"material-symbols:library-music"}
              displayText={expand ? "My music" : ""}
            />
          </NavLink>
        )}
      </div>

      <div className="flex flex-col flex-1 p-2 py-2 m-2 rounded-lg bg-darkgray h-4/6">
        <div className="flex items-center justify-between mb-6 text-primarytext hover:child:text-white">
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                if (expand) {
                  setLeftPanelWidth(100);
                } else {
                  setLeftPanelWidth(400);
                }
                setExpand(!expand);
              }}
              className="flex items-center gap-4 px-4 py-2 font-bold"
            >
              {sidebarIcons.expandIcon}
            </button>
            {expand && <p className="font-semibold">Your Library</p>}
          </div>

          {/* //options  */}
          {expand && <CreateOption />}
        </div>

        {/* ////===if there is liked song or playlist available in user database the show that=====//// */}
        {auth && PlaylistData.length !== 0 ? (
          <div className="overflow-auto playlistitem" id="custom-scrollbar">
            {PlaylistData.map((item) => {
              // console.log(item);
              return (
                <PlaylistListComponent
                  expand={expand}
                  key={item._id}
                  name={item.name}
                  img={item.thumbnail}
                  user={item.owner.name}
                  playlistId={item._id}
                />
              );
            })}
          </div>
        ) : (
          <div
            className={` ${
              !expand ? "hidden" : ""
            } library-container overflow-hidden h-[140px] relative`}
          >
            <div
              id="custom-scrollbar"
              className="h-full overflow-y-scroll library-content"
            >
              <div className="p-4 mb-4 rounded-lg bg-lightgray">
                <h1 className="font-bold text-[1.1rem]">
                  Create your first playlist
                </h1>

                <p className="font-semibold">It's easy, we'll help you</p>
                <button
                  onClick={createPlaylist}
                  className={`${
                    !expand ? "hidden" : ""
                  } w-[140px] h-[35px] bg-white text-black flex justify-center items-center rounded-full align-middle font-bold mt-4 pb-[2px] hover:scale-105 
                  
                   
                }`}
                >
                  Create Playlist
                </button>
              </div>
              <div className="p-4 mb-4 rounded-lg bg-lightgray">
                <h1 className="font-bold text-[1.1rem]">
                  Let's find some pordcasts to follow
                </h1>

                <p className="font-semibold">
                  We'll keep you updated on new episodes
                </p>
                <button
                  className={`w-[160px] h-[35px] bg-white text-black flex justify-center items-center rounded-full align-middle font-bold mt-4 pb-[2px] hover:scale-105 
                  
                   
                }`}
                >
                  Browse podcasts
                </button>
              </div>
            </div>
          </div>
        )}

        {auth ? (
          ""
        ) : (
          <div>
            {" "}
            <div className="flex flex-wrap mx-4 mt-4 mb-6 child:text-xs child:text-gray-300 gap-x-4 gap-y-1">
              <a href="">Legal</a>
              <a href="">Privacy Center</a>
              <a href="">Privacy Policy</a>
              <a href="">Cookies</a>
              <a href="">About Ads</a>
              <a href="">Accessibility</a>
              <a href="">Notice at collection</a>
              <a href="">Your Privacy Choices</a>
              <a href="">Cookies</a>
            </div>
            <div className="ml-4">
              <button
                className={`w-[100px] h-[35px] hover:border-white border-2 border-primarytext flex justify-center items-center rounded-full align-middle font-bold mt-2 pb-[2px] hover:scale-105 }`}
              >
                <Icon icon="ph:globe" className="w-[25px] h-[25px]" />
                English
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
