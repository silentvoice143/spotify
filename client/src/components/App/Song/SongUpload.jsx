import React, { useContext, useState, useCallback } from "react";

import Navbar from "../../Nav/Navbar";
import { AuthContext } from "../../../context/AuthContext";
import Sidebar from "../../shared/Sidebar";
import CreateSong from "./createSongutils/CreateSong";

function SongUpload() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex flex-1">
      <CreateSong />
    </div>
  );
}

export default SongUpload;
