import React, { useContext } from "react";

import { Icon } from "@iconify/react";
import { SongContext } from "../../../context/SongContext";
import { useParams } from "react-router-dom";
import { makeAuthenticatedPOSTRequest } from "../../../utils/apiHelper";

function SingleSongCard({ info, add, setSongRefresh }) {
  const playlistId = useParams("playlist_id");
  // console.log(info);

  const { currentSong, setCurrentSong } = useContext(SongContext);
  const addToPlaylist = async () => {
    const route = "/playlist/addSong";
    // console.log(info);
    const body = {
      playlistId: playlistId.playlist_id,
      songId: info._id,
    };
    const response = await makeAuthenticatedPOSTRequest(route, body);
    // console.log(response);
    setSongRefresh((prev) => !prev);
  };
  return (
    <div
      className="flex p-4 cursor-default hover:bg-lightgray"
      onClick={() => {
        setCurrentSong(info);
        // playSound(info.track);
      }}
    >
      <div
        className="w-12 h-12 bg-center bg-cover"
        style={{
          backgroundImage: `url(
            "${info.thumbnail}"
          )`,
        }}
      ></div>
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col justify-center flex-1 pl-4">
          <div className="font-spotify hover:underline">{info.name}</div>
          <div className="text-xs text-primarytext">{info.artist.name}</div>
        </div>
        <div
          className={`${
            add ? "hidden" : "flex"
          } items-center justify-center gap-4`}
        >
          <button className="pr-2 like">
            {!info.liked ? (
              <Icon icon="mdi:heart-outline" className="w-5 h-5" />
            ) : (
              <Icon icon="mdi:heart" className="w-5 h-5 text-spotify_green" />
            )}
          </button>
          <p>{info.duration}</p>
          <div className="pb-2">
            <p className="text-2xl font-semibold">...</p>
          </div>
        </div>
        <div
          onClick={addToPlaylist}
          className={`${
            add
              ? "border-[1px] flex justify-center items-center h-fit border-lightgray rounded-full hover:scale-[1.1] hover:border-white"
              : "hidden"
          } `}
        >
          <p className="px-4 py-1 text-sm font-semibold">Add</p>
        </div>
      </div>
    </div>
  );
}

export default SingleSongCard;
