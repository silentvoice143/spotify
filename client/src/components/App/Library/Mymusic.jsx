import React, { useState, useEffect } from "react";
import { Howl, Howler } from "howler";
import SingleSongCard from "../Song/SingleSongCard";
import getToken from "../../../utils/getToken";

//for stylesheet
import "../../shared/style.css";

//api calling import
import { makeAuthenticatedGETRequest } from "../../../utils/apiHelper";

function Mymusic() {
  const [songData, setSongData] = useState([]);

  //for controling sonund palyed
  const [sonunPlayed, setSoundPlayed] = useState(null);

  const playSound = (src) => {
    if (sonunPlayed) {
      sonunPlayed.stop();
    }
    // console.log("playing sound");
    var sound = new Howl({
      src: [src],
      html5: true,
    });

    setSoundPlayed(sound);

    sound.play();
    console.log(sound);
  };

  useEffect(() => {
    const token = getToken();
    // console.log(token);
    const getData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(
          "/song/mysongs",
          token
        );
        if (response && !response.err) {
          console.log(response);
          setSongData(response.data);
        } else {
          alert(response.err);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return (
    <div className="flex-1 px-4" id="custom-scrollbar">
      <div className="p-4 text-2xl font-bold heading hover:underline">
        My songs
      </div>
      {songData.length > 0 ? (
        songData.map((item) => {
          return <SingleSongCard key={item._id} info={item} add={false} />;
        })
      ) : (
        <h1 className="text-gray-500 text-center text-[2rem]">
          No data found.
        </h1>
      )}
    </div>
  );
}

export default Mymusic;
