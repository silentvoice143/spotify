import React, { useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { Icon } from "@iconify/react";
import { makeAuthenticatedGETRequest } from "../../../utils/apiHelper";
import SingleSongCard from "../Song/SingleSongCard";

// stylesheet
import "../../shared/style.css";
import { PlaylistCard } from "../Playlist/PlaylistCard";
import music from "../../../assets/images/music.png";
import { Link } from "react-router-dom";

function SearchPage() {
  const [inputFocus, setInputFocus] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showClear, setShowClear] = useState(false);
  const [cookies, setCookie] = useCookies(["token", "email"]);
  const [songData, setSongData] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);

  const clearInput = () => {
    setInputText("");
    setShowClear(false);
    setSongData([]);
    setPlaylistData([]);
  };

  const handleInputChange = async (e) => {
    setInputText(e.target.value);

    if (e.target.value.length > 0) {
      setShowClear(true);

      const route = "/search/all/" + e.target.value;
      const token = cookies.token;
      const data = await makeAuthenticatedGETRequest(route, token);
      console.log(data);
      setSongData(data.songs);
      setPlaylistData(data.playlists);
    } else {
      setShowClear(false);
      setSongData([]);
      setPlaylistData([]);
    }
  };
  return (
    <div
      className="flex flex-col w-full p-4 overflow-auto"
      id="custom-scrollbar"
    >
      <div className="relative w-1/3">
        <div className="absolute left-3 top-4">
          <Icon
            icon="mingcute:search-line"
            className={`w-[20px] h-[20px]  ${
              inputFocus ? "text-white" : "text-primarytext"
            }`}
          />
        </div>
        <input
          type="text"
          autoComplete="off"
          name="searchInput"
          id="searchbox"
          placeholder="What do you want to listen to?"
          className={`w-full p-3 bg-lightgray rounded-full px-12 outline-none border-2 ${
            inputFocus ? "border-white" : "border-transparent"
          }`}
          onFocus={() => {
            setInputFocus(true);
          }}
          onBlur={() => {
            setInputFocus(false);
          }}
          value={inputText}
          onChange={handleInputChange}
        />

        <div className="absolute right-3 top-4">
          <Icon
            icon="ic:baseline-close"
            className={`w-[20px] h-[20px]  ${
              showClear ? "text-white" : "hidden"
            }`}
            onClick={clearInput}
          />
        </div>
      </div>
      <div className="relative flex flex-1 w-full mt-8 overflow-hidden gap-x-4">
        {/* <div className="w-full"></div> */}
        <div className="flex flex-col flex-1 w-1/3">
          <h1 className="mb-4 text-2xl font-bold">Songs</h1>
          <div
            className="flex-1 overflow-auto scroll-smooth"
            id="hidden-scrollbar"
          >
            {songData.length > 0 ? (
              songData.map((item, index) => {
                return (
                  <SingleSongCard key={item._id} info={item} index={index} />
                );
              })
            ) : (
              <h1 className="text-gray-500 text-md">No data found.</h1>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <h1 className="mb-4 text-2xl font-bold">Playlists</h1>
          <div
            className="relative flex flex-wrap overflow-y-scroll gap-x-4 gap-y-8 scroll-smooth"
            id="hidden-scrollbar"
          >
            {playlistData.length > 0 ? (
              playlistData.map((item) => {
                return <PlaylistCard key={item._id} playlist={item} />;
              })
            ) : (
              <h1 className="text-gray-500 text-md">No data found.</h1>
            )}
            {/* <Link className="relative block bg-[#1a1a1aad] rounded-lg p-4 w-[200px] hover:bg-lightgray">
              <img
                className="w-full overflow-hidden rounded-lg aspect-square"
                src={music}
              />

              <div className="mt-4">
                <h1 className="mb-2 font-bold">Satyam</h1>
                <p className="leading-5 text-primarytext line-clamp-2 font-opensans">
                  satyam
                </p>
              </div>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
