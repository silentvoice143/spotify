import { createContext, useEffect, useState } from "react";

// const SongContext = createContext({
//   currentSong: null,
//   setCurrentSong: (currentSong) => {},
// });

const SongContext = createContext("");

const SongProvider = ({ children }) => {
  // State for the currently playing song
  const [currentSong, setCurrentSong] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(null);
  const [isPaused, setIsPaused] = useState(true);

  return (
    <SongContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        soundPlayed,
        setSoundPlayed,
        isPaused,
        setIsPaused,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export { SongContext, SongProvider };
