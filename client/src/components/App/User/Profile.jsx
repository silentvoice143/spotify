import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineEdit } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";

import music from "../../../assets/images/music.png";
import ProfileEditModal from "../../modals/ProfileEditModal";
import { PlaylistContext } from "../../../context/PlaylistContext";
import { PlaylistCard } from "../Playlist/PlaylistCard";
import { Cookies, useCookies } from "react-cookie";

function Profile() {
  const [isHovered, setIsHovered] = useState(false);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [toggleOptions, setToggleOptions] = useState(false);
  const [saveClicked, setSaveClicked] = useState(true);
  const [userData, setUserData] = useState("");
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [privatePlaylists, setPrivatePlaylists] = useState([]);
  const [publicPlaylistNumber, setPublicPlaylistNumber] = useState(0);
  const [refreshProfile, setRefreshProfile] = useState(false);
  const { PlaylistData, setPlaylistRefresh } = useContext(PlaylistContext);

  const [cookies] = useCookies(["user"]);
  useEffect(() => {
    let playlists = [];
    let privateplaylists = [];
    let cnt = 0;
    PlaylistData.forEach((playlist) => {
      if (playlist.type === "public") {
        playlists.push(playlist);
        ++cnt;
      } else {
        privateplaylists.push(playlist);
      }
    });
    setPublicPlaylistNumber(cnt);
    setPublicPlaylists(playlists);
    setPrivatePlaylists(privateplaylists);
  }, [PlaylistData]);

  useEffect(() => {
    setUserData(cookies.user);
  }, [refreshProfile, saveClicked]);
  return (
    <div className={"flex flex-col w-full overflow-auto"} id="custom-scrollbar">
      {toggleEdit && (
        <ProfileEditModal
          setToggleProfileEdit={setToggleEdit}
          setSaveClicked={setSaveClicked}
        />
      )}
      <div className={`relative flex gap-4 p-6 bg-white-gradient`}>
        <div
          onMouseOver={() => {
            setIsHovered(true);
          }}
          onMouseOut={() => {
            setIsHovered(false);
          }}
          className=" relative mt-4 w-[230px] h-[230px] flex justify-center items-center bg-lightgray rounded-full shadow-primary-shadow overflow-hidden"
        >
          {true ? (
            !isHovered ? (
              <IoPersonCircleOutline className="w-12 h-12 text-gray-400" />
            ) : (
              <MdOutlineEdit className="w-12 h-12 text-gray-400" />
            )
          ) : (
            <img
              className="absolute top-0 left-0 w-full h-full"
              src={music}
              alt=""
            />
          )}
        </div>
        <div className="flex flex-col justify-end flex-1 cursor-pointer">
          <h2 className="text-sm font-bold">Profile</h2>
          <h1
            onClick={() => {
              setToggleEdit(true);
            }}
            className="text-[6rem] font-bold"
          >
            {userData.name}
          </h1>
          <h2 className="pl-1 font-semibold cursor-default hover:underline">
            {publicPlaylistNumber} public playlists
          </h2>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="relative">
          <div className="my-8 ">
            <span
              className="font-extrabold tracking-wide text-[1.2rem] cursor-pointer text-primarytext hover:text-white"
              onClick={() => {
                setToggleOptions((prev) => !prev);
              }}
            >
              . . .
            </span>
          </div>
          <div
            className={`${
              toggleOptions ? "" : "hidden"
            } absolute top-12  rounded-md z-[99999] flex bg-spotifybg shadow-primary-shadow`}
          >
            <ul className="flex flex-col p-2 font-semibold hover:child:bg-lightgray child:px-4 child:py-2 child:text-sm child:cursor-default">
              <li
                onClick={() => {
                  setToggleEdit(true);
                  setToggleOptions(false);
                }}
              >
                Edit Profile
              </li>
              <li>Copy Profile Link</li>
            </ul>
          </div>
        </div>
        <div>
          <h1 className="my-8 text-2xl font-bold cursor-pointer hover:underline">
            Public Playlists
          </h1>
          <div className="flex flex-wrap w-full gap-y-8 gap-x-4 playlist_list">
            {publicPlaylists.map((playlist) => {
              return <PlaylistCard playlist={playlist} key={playlist._id} />;
            })}
          </div>
          <h1 className="mt-8 py-8 text-2xl font-bold border-t-[1px] border-lightgray cursor-pointer hover:underline">
            Private Playlists
          </h1>
          <div className="flex flex-wrap w-full gap-y-8 gap-x-4 playlist_list">
            {privatePlaylists.map((playlist) => {
              return <PlaylistCard playlist={playlist} key={playlist._id} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
