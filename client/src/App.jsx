import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SongProvider } from "./context/SongContext.jsx";
import { PlaylistProvider } from "./context/PlaylistContext.jsx";

/////////
import "./App.css";

//////
import WithNav from "./Routes/WithNav.jsx";
import WithoutNav from "./Routes/NoNav.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import SongUpload from "./components/App/Song/SongUpload.jsx";
import AuthHome from "./components/App/Home/AuthHome.jsx";
import Mymusic from "./components/App/Library/Mymusic.jsx";
import SearchPage from "./components/App/Search/SearchPage.jsx";
import Playlist from "./components/App/Playlist/Playlist.jsx";

////=========tostify for notifications=========////
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/App/User/Profile.jsx";

function App() {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<WithoutNav />}>
            {!isAuthenticated ? (
              <>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/signup/:admin" element={<Signup />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              ""
            )}
          </Route>
          <Route
            element={
              <PlaylistProvider>
                <SongProvider>
                  <WithNav />
                </SongProvider>
              </PlaylistProvider>
            }
          >
            <>
              <Route path="/" element={<AuthHome />} exact />
            </>

            {isAuthenticated ? (
              <>
                <Route path="/playlist/:playlist_id" element={<Playlist />} />
                <Route path="/uploadsong" element={<SongUpload />} />
                {isAdmin && <Route path="/mymusic" element={<Mymusic />} />}
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<Profile />} />
              </>
            ) : (
              ""
            )}
            {isAuthenticated ? (
              <Route path="*" element={<Navigate to="/" />} />
            ) : (
              ""
            )}
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
