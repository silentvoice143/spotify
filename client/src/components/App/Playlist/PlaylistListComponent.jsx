import React from "react";
import demoimg from "../../../assets/images/music.png";
import { Link, NavLink } from "react-router-dom";

function PlaylistListComponent({ img, name, user, playlistId }) {
  return (
    <NavLink to={`/playlist/${playlistId}`}>
      <div className="flex gap-4 p-2 rounded-md hover:bg-lightgray">
        {img === "" ? (
          <img className="w-12 h-12 rounded-md" src={demoimg} alt="" />
        ) : (
          <img className="w-12 h-12 rounded-md" src={img} alt="" />
        )}
        <div>
          <h1>{name}</h1>
          <p className="text-sm font-semibold text-gray-200">
            Playlist <span className="text-lg font-bold">. </span>
            {user}
          </p>
        </div>
      </div>
    </NavLink>
  );
}

export default PlaylistListComponent;
