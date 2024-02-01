import React, { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { PlaylistContext } from "../../../context/PlaylistContext";
import { showErrorToast, showSuccessToast } from "../error/ShowToast";
import PulseLoader from "react-spinners/PulseLoader";

////=====react-icons======////
import { FiMusic } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import { MdPublicOff } from "react-icons/md";

import { MdFavoriteBorder } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineModeEdit } from "react-icons/md";

import {
  makeAuthenticatedPOSTRequest,
  makeAuthenticatedGETRequest,
  makeAuthenticatedDELETERequest,
  makeAuthenticatedPUTRequest,
} from "../../../utils/apiHelper";

import "../../shared/style.css";

/////=========modal=================///
import CreatePlaylistModal from "../../modals/CreatePlaylistModal";
import SingleSongCard from "../Song/SingleSongCard";

function Playlist() {
  const navigate = useNavigate();

  ///=====context=========////
  const { setPlaylistRefresh } = useContext(PlaylistContext);

  ////===for toggeling purpose===////
  const [toggleOptions, setToggleOptions] = useState(false);
  const [toggleEdit, setToggleEdit] = useState(false);

  ////======data=======////
  const [playListData, setPlaylistData] = useState("");
  const [userData, setUserData] = useState("");
  const [songData, setSongData] = useState([]);
  const [playlistSongData, setPlaylistSongData] = useState([]);

  ////========for editing and details=======/////
  const [thumbnail, setThumbnail] = useState("");
  const [saveClicked, setSaveClicked] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showClear, setShowClear] = useState(false);
  const [playlistType, setPlaylistType] = useState("");
  const [color, setColor] = useState("");

  ////======for editing permission=========/////
  const [canEdit, setCanEdit] = useState(false);
  const [canAddSong, setCanAddSong] = useState(false);

  const [cookies] = useCookies(["user"]);

  ////======for handling refresh of playlist========///
  const [Refresh, setRefresh] = useState(false);

  ////======Loading=======/////
  const [Loading, setLoading] = useState(false);

  const playlistId = useParams("playlist_id");
  // console.log(playlist_id);

  useEffect(() => {
    ////getting playlist detail by id as req body////
    const getPlaylist = async () => {
      console.log("refreshing playlist");
      const response = await makeAuthenticatedPOSTRequest(
        "/playlist",
        playlistId
      );
      const playlist = response.playlist;
      console.log(playlist.owner.name);

      if (cookies.user._id === playlist.owner._id) {
        setCanEdit(true);
      }

      if (
        playlist.collaborators.includes(cookies.user._id) ||
        playlist.owner._id === cookies.user._id
      ) {
        setCanAddSong(true);
      }
      setThumbnail(playlist.thumbnail);
      setPlaylistData(playlist);
      setUserData(response.userData);
      setPlaylistSongData(playlist.songs);
      setPlaylistType(playlist.type);
      setSaveClicked(false);
    };
    getPlaylist();
  }, [playlistId, saveClicked, Refresh, toggleEdit]);

  useEffect(() => {
    const randomColor = () => {
      var colors = [
        "bg-green-gradient",
        "bg-pink-gradient",
        "bg-orange-gradient",
        "bg-red-gradient",
        "bg-yellow-gradient",
        "bg-sky-gradient",
      ];

      const random = Math.floor(Math.random() * 6);
      // console.log(random);
      setColor(colors[random]);
    };
    randomColor();
  }, [playlistId]);

  ////========for all songs on search==========////
  const handleInputChange = async (e) => {
    setInputText(e.target.value);

    if (e.target.value.length > 0) {
      setShowClear(true);

      const route = "/search/all/" + e.target.value;

      const data = await makeAuthenticatedGETRequest(route);
      // console.log(data);
      setSongData(data.songs);
    } else {
      setShowClear(false);
      setSongData([]);
    }
  };

  ////======delete the playlist by id=======////
  const deletePlaylist = async () => {
    const route = "/playlist/delete/" + playlistId.playlist_id;

    const response = await makeAuthenticatedDELETERequest(route);
    if (response && !response.error) {
      showSuccessToast(response.message);
      setPlaylistRefresh((prev) => !prev);
      navigate("/");
    } else {
      showErrorToast(response.error);
    }
  };

  const setTypeofPlaylist = async (type) => {
    const route = "/playlist/edittype/" + playlistId.playlist_id;

    const body = {
      type: type,
    };
    const response = await makeAuthenticatedPUTRequest(route, body);
    // console.log(response);
    if (response && !response.error) {
      showSuccessToast(response.message);
      setRefresh((prev) => !prev);
      setPlaylistRefresh((prev) => !prev);
    } else {
      showErrorToast(response.error);
    }
  };

  ///=====loader style=====////
  const override = {
    display: "block",
    "z-index": "99999",
    position: "absolute",
    margin: "0 auto",
    transform: "translate(47vw,40vh)",
    borderColor: "green",
  };
  return (
    <div className={"flex flex-col w-full overflow-auto"} id="custom-scrollbar">
      {Loading && (
        <div className="absolute top-0 left-0 z-[99999] h-[100vh] w-full bg-black bg-opacity-70">
          <PulseLoader color="#1db954" cssOverride={override} />
        </div>
      )}
      {canEdit && toggleEdit && (
        <CreatePlaylistModal
          playListData={playListData}
          setToggleEdit={setToggleEdit}
          playlistId={playlistId}
          setSaveClicked={setSaveClicked}
          setLoading={setLoading}
        />
      )}
      <div className={`relative flex gap-4 p-6 ${color}`}>
        <div className=" relative w-[250px] h-[250px] flex justify-center items-center bg-lightgray rounded-md shadow-primary-shadow overflow-hidden">
          {thumbnail == "" ? (
            <FiMusic className="w-12 h-12 text-gray-400" />
          ) : (
            <img
              className="absolute top-0 left-0 w-full h-full"
              src={thumbnail}
              alt=""
            />
          )}
        </div>
        <div className="flex flex-col justify-end flex-1">
          <h2 className="text-sm font-bold cursor-default">Playlist</h2>
          <h1
            className="text-[6rem] font-bold cursor-default"
            onClick={() => {
              setToggleEdit(true);
            }}
          >
            {playListData.name}
            {/* Name */}
          </h1>
          <h2 className="pl-1 font-semibold cursor-default hover:underline">
            {playListData ? playListData.owner.name : ""}
          </h2>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="relative">
          <div className="mx-6 text-[2.5rem] flex items-center border-lightgray border-b-[0.5px]">
            <span
              onClick={() => {
                setToggleOptions((prev) => !prev);
              }}
              className="p-4 pl-0 cursor-pointer text-primarytext hover:text-white"
            >
              ...
            </span>
          </div>
          <div
            className={`${
              toggleOptions ? "" : "hidden"
            } absolute top-18 left-4  rounded-md z-[99999] flex bg-spotifybg shadow-primary-shadow`}
          >
            <ul className="flex flex-col p-2 font-semibold child:flex child:gap-x-2 child:items-center hover:child:bg-lightgray child:px-4 child:py-2 child:text-sm child:cursor-default">
              {canEdit && (
                <li
                  onClick={() => {
                    setToggleEdit(true);
                    setToggleOptions(false);
                  }}
                >
                  <MdOutlineModeEdit className="w-4 h-4" />
                  Edit details
                </li>
              )}
              {canEdit ? (
                playlistType === "private" ? (
                  <li
                    onClick={() => {
                      setTypeofPlaylist("public");
                    }}
                  >
                    <MdPublic className="w-4 h-4" />
                    Set As Public
                  </li>
                ) : (
                  <li
                    onClick={() => {
                      setTypeofPlaylist("private");
                    }}
                  >
                    <MdPublicOff className="w-4 h-4" />
                    Set As Private
                  </li>
                )
              ) : (
                ""
              )}

              {canEdit && (
                <li onClick={deletePlaylist}>
                  <MdDeleteOutline className="w-4 h-4" />
                  Delete Playlist
                </li>
              )}
              <li>
                <MdFavoriteBorder className="w-4 h-4" />
                Add to favourite
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col mx-6 mt-4">
          <div className="flex">
            <h1 className="pb-2 font-bold">Songs</h1>
          </div>
          {playlistSongData.map((item) => {
            return <SingleSongCard key={item._id} info={item} />;
          })}
        </div>
        {canAddSong && (
          <>
            <div className="px-6 py-4">
              <h1 className="mb-4 text-2xl font-bold">
                Let's find something for your playlist
              </h1>
              <div className="relative w-1/3">
                <IoSearch className="absolute w-5 h-5 text-gray-400 top-3 left-2" />
                <input
                  onFocus={() => {
                    setInputFocus(true);
                  }}
                  onBlur={() => {
                    setInputFocus(false);
                  }}
                  value={inputText}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Search for songs"
                  className="w-full px-8 py-2 text-gray-400 rounded-md outline-none bg-lightgray"
                />
              </div>
            </div>

            <div className="flex flex-col px-6">
              {songData.map((item) => {
                return (
                  <SingleSongCard
                    key={item._id}
                    info={item}
                    add={true}
                    setSongRefresh={setRefresh}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Playlist;
