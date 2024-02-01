import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FaMusic } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

//firebasedb
import storage from "../../../../utils/firebase.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

//inport images
import stereo from "../../../../assets/images/stereo.jpg";

//components
import SongEdit from "./EditSong.jsx";
import Uploadprogress from "./Uploadprogress.jsx";
import { makeAuthenticatedPOSTRequest } from "../../../../utils/apiHelper.js";
import { showErrorToast, showSuccessToast } from "../../error/ShowToast.jsx";

function CreateSong() {
  //
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token", "email"]);

  // toggler
  // const [textField, setTextfeild] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [songdetailToggle, setSongdetailToggle] = useState(true);
  const [uploadClicked, setUploadClicked] = useState(false);

  //for song and image controls

  const [songname, setSongName] = useState("");
  const [originalsongname, setOriginalsongtName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [songUploadProgress, setSongUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(stereo);
  const [songUrl, setSongUrl] = useState("");

  //handle changes function

  //FOR THUMBNAIL PREVIEW

  const handledetailToggle = () => {
    setSongdetailToggle((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check if the selected file is an image
      if (isImageFile(file)) {
        const img = URL.createObjectURL(file);
        setImageUrl(img);
        setSelectedImage(file);
        // Perform further actions with the image file if needed
      } else {
        console.log(
          "Invalid image file type. Please select a supported image file."
        );
      }
    }
  };

  const isImageFile = (file) => {
    // Add logic to check if the file type is an image file (e.g., JPEG, PNG, GIF, etc.)
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"]; // Add more types as needed
    return allowedFileTypes.includes(file.type);
  };

  //for song upload using drag and drop

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // for drag event

  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    // Handle the dropped file(s) here
    const files = e.dataTransfer.files;
    // Check if the dropped file is a music file (you can adjust the check based on your specific requirements)
    if (files.length == 1) {
      if (files.length > 0 && isMusicFile(files[0])) {
        console.log("Valid music file:", files[0]);
        setSelectedSong(files);

        // Perform further actions with the music file
      } else {
        console.log("Invalid file type. Please drop a music file.");
      }
      setIsDraggedOver(false);
    } else {
      console.log("Drop only one file");
    }
  };

  const handleSongChange = (e) => {
    setSelectedSong(e.target.files[0]);
    setOriginalsongtName(e.target.files[0].name);
  };

  const isMusicFile = (file) => {
    // Add logic to check if the file type is a music file (e.g., MP3, WAV, etc.)
    const allowedFileTypes = ["audio/mpeg", "audio/wav"]; // Add more types as needed
    return allowedFileTypes.includes(file.type);
  };

  /////////////////////

  const uploadImage = async () => {
    if (!selectedImage) {
      console.error("Please select an image");
      return;
    }

    const imageRef = ref(storage, `/images/${selectedImage.name}`);

    try {
      const imageTask = uploadBytesResumable(imageRef, selectedImage);

      imageTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setImageUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
        }
      );

      await imageTask;

      const imageUrl = await getDownloadURL(imageRef);
      setImageUrl(imageUrl);
      // console.log("Image uploaded:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const uploadSong = async () => {
    if (!selectedSong) {
      showErrorToast("Please select a song");
      return;
    }

    const songRef = ref(storage, `/songs/${selectedSong.name}`);

    try {
      const songTask = uploadBytesResumable(songRef, selectedSong);

      songTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setSongUploadProgress(progress);
        },
        (error) => {
          showErrorToast("Error uploading song:", error);
        }
      );

      await songTask;

      const songUrl = await getDownloadURL(songRef);
      setSongUrl(songUrl);
      // showSuccessToast("Song uploaded:", songUrl);
      return songUrl;
    } catch (error) {
      showErrorToast("Error uploading song:", error);
    }
  };

  const handleUpload = async () => {
    const img = await uploadImage();
    const song = await uploadSong();
    if (!song) return;
    saveDataToMongo(song, img);
  };

  const saveDataToMongo = async (songurl, imgurl) => {
    try {
      const data = {
        name: songname,
        track: songurl,
        thumbnail: imgurl,
      };

      const response = await makeAuthenticatedPOSTRequest(
        "/song/upload",
        data,
        cookies.token
      );
      console.log(response);
      if (response && !response.error) {
        // console.log("Data saved to MongoDB:", response);
        showSuccessToast("Song successfully added");
      } else {
        showErrorToast(response.error);
        throw new Error("Failed to save data to MongoDB.");
      }

      // navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  ////

  ///////////////

  return (
    <div className="flex flex-1 gap-4 bg-white-gradient song-uploadsection ">
      {/* /////detail enter box  */}
      <SongEdit
        hidden={songdetailToggle}
        imageurl={imageUrl}
        songname={songname}
        originalsongname={originalsongname}
        SetSongname={setSongName}
        setHidden={handledetailToggle}
        handleImageChange={handleImageChange}
        setSelectedSong={handleSongChange}
        setUploadClicked={setUploadClicked}
        saveData={handleUpload}
      />

      {/* /// main container for song detail viewing  */}
      <div className="">
        <label
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-[400px] h-[400px] flex justify-center items-center bg-lightgray rounded-md mx-8 my-12"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
          }}
          htmlFor="songImg"
        >
          <input
            className="hidden"
            type="file"
            name="songImg"
            id="songImg"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />

          {isHovered && !uploadClicked ? (
            <div className="flex flex-col items-center justify-center text-sm">
              <MdEdit className="w-[50px] h-[50px]" />
              <p className="text-center">Edit thumbnail</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-sm">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  style={{ height: "300px", width: "300px" }}
                />
              ) : (
                <>
                  <FaMusic className="w-[50px] h-[50px]" />
                  <p className="text-center">
                    Drag and drop <br /> thumbnail
                  </p>
                </>
              )}
            </div>
          )}
        </label>
      </div>

      <div className="flex-1 h-full pt-12 cursor-default">
        <div>
          <div>
            <div className={`flex flex-col justify-start mt-8`}>
              <>
                <p className="text-black">Song</p>

                <h1
                  onClick={() => {
                    handledetailToggle();
                  }}
                  className="flex-1 flex gap-4 items-center w-fit text-[6rem] font-robo font-bold text-white"
                >
                  {songname ? songname : "My Song"}
                  {/* <div
                    className={`${
                      uploadClicked ? "hidden" : ""
                    } p-4 rounded-full bg-darkgray hover:bg-lightgray`}
                    onClick={() => {
                      handledetailToggle();
                    }}
                  >
                    <MdEdit className="w-[25px] h-[25px]" />
                  </div> */}
                </h1>

                <div className={`${uploadClicked ? "" : "hidden"} child:mb-8 `}>
                  <Uploadprogress
                    text={"thumbnail"}
                    uploadProgress={imageUploadProgress}
                  />
                  <Uploadprogress
                    text={"song"}
                    uploadProgress={songUploadProgress}
                  />

                  <div className="text-center">
                    <audio
                      src={songUrl ? songUrl : ""}
                      controls
                      autoPlay
                    ></audio>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSong;
