import React, { createContext, useState, useEffect } from "react";
import { Cookies, useCookies } from "react-cookie";
import { makeAuthenticatedGETRequest } from "../utils/apiHelper";

// Create a context with an initial value (in this case, an empty string)
const PlaylistContext = createContext("");

// Step 2: Create a provider component
const PlaylistProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useCookies(["token"]);

  const [PlaylistData, setPlaylistData] = useState([]);
  const [playlistRefresh, setPlaylistRefresh] = useState(false);

  const getplaylist = async () => {
    const route = "/playlist/all";
    const response = await makeAuthenticatedGETRequest(route);
    if (response.error) {
      console.log(response.error);
    }
    // console.log(response.data);
    setPlaylistData(response.data);
  };

  useEffect(() => {
    if (cookies.token) {
      getplaylist();
    }
  }, [playlistRefresh]);

  return (
    <PlaylistContext.Provider
      value={{
        PlaylistData,
        playlistRefresh,
        setPlaylistData,
        setPlaylistRefresh,
        loading,
        setLoading,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export { PlaylistContext, PlaylistProvider };
