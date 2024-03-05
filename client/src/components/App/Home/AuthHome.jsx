import React, { useContext, useEffect, useState } from "react";
// import PulseLoader from "react-spinners/PulseLoader";

//playlist components
import PlaylistView from "../Playlist/PlaylistView";

import "../../shared/style.css";
import { makeAuthenticatedGETRequest } from "../../../utils/apiHelper";
import { AuthContext } from "../../../context/AuthContext";

const songs = [
  {
    key: 1,
    title: "The rock",
    description: "hello hkfjdio jkdjsfjkdf jfdkl jfjkf lkdjf fj lfdkdkjf",
    imgUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    key: 2,
    title: "The rock",
    description: "hello hkfjdio jkdjsfjkdf jfdkl jfjkf lkdjf fj lfdkdkjf",
    imgUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    key: 3,
    title: "The rock",
    description: "hello hkfjdio jkdjsfjkdf jfdkl jfjkf lkdjf fj lfdkdkjf",
    imgUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    key: 4,
    title: "The rock",
    description: "hello hkfjdio jkdjsfjkdf jfdkl jfjkf lkdjf fj lfdkdkjf",
    imgUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    key: 5,
    title: "The rock",
    description: "hello hkfjdio jkdjsfjkdf jfdkl jfjkf lkdjf fj lfdkdkjf",
    imgUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
  },
];

function AuthHome() {
  const { loading, setLoading } = useContext(AuthContext);

  const [randomPlaylists, setRandomPlaylists] = useState([]);

  useEffect(() => {
    setLoading(true);
    const route = "/playlist/random";
    const getrandomPlaylist = async () => {
      const response = await makeAuthenticatedGETRequest(route);
      if (response.err) {
        alert(response.err);
        return;
      }
      // console.log(response.data);

      setRandomPlaylists(response.data);
      setLoading(false);
    };
    getrandomPlaylist();
  }, []);

  return (
    <div className="w-full content" id="custom-scrollbar">
      <PlaylistView playlists={randomPlaylists} heading="Zzzzz" />
      {/* <PlaylistView playlists={randomPlaylists} heading="Morning" /> */}
      {/* <PlaylistView playlists={randomPlaylists} heading="Latest" /> */}
    </div>
  );
}

export default AuthHome;
