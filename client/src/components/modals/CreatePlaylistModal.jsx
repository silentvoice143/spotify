import React, { useContext, useEffect, useRef, useState } from "react";
import { FiMusic } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import storage from "../../utils/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { makeAuthenticatedPUTRequest } from "../../utils/apiHelper";
import { PlaylistContext } from "../../context/PlaylistContext";
import { showSuccessToast } from "../App/error/ShowToast";

function CreatePlaylistModal({
  setToggleOptions,
  playListData,
  setToggleEdit,
  playlistId,
  setSaveClicked,
  setLoading,
}) {
  const { setPlaylistRefresh } = useContext(PlaylistContext);
  const [clickedName, setClickedName] = useState(false);
  const [clickedDesc, setClickedDesc] = useState(false);

  const [playlistname, setPlaylistName] = useState(playListData.name);
  const [selectedthumbnail, setSelectedThumbnail] = useState("");
  const [imageSrc, setImageSrc] = useState(playListData.thumbnail);
  const [desc, setDesc] = useState(playListData.desc);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedThumbnail(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataURL = e.target.result;
        setImageSrc(dataURL);
      };

      // Read the file as a data URL, triggering the onload event
      reader.readAsDataURL(file);
    }
  };
  const playlistid = useParams("playlist_id");
  const editPlaylist = async () => {
    setToggleEdit(false);
    setLoading(true);
    const uploadImage = async () => {
      if (!selectedthumbnail) {
        console.error("Please select an image");
        return;
      }

      const imageRef = ref(storage, `/images/${selectedthumbnail.name}`);

      try {
        const imageTask = uploadBytesResumable(imageRef, selectedthumbnail);

        imageTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            // setImageUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading image:", error);
          }
        );

        await imageTask;

        const imageUrl = await getDownloadURL(imageRef);
        console.log("Image uploaded:", imageUrl);
        return imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
    const route = "/playlist/edit/" + playlistid.playlist_id;
    let imgurl = "";
    if (selectedthumbnail) {
      imgurl = await uploadImage();
    }
    const body = {
      name: playlistname,
      desc: desc,
      thumbnail: imgurl,
    };
    const response = await makeAuthenticatedPUTRequest(route, body);
    console.log(response);
    if (response.error) {
      alert("try again!!!!!");
    }
    showSuccessToast("Playlist updated successfully");
    setPlaylistRefresh((prev) => !prev);
    setSaveClicked(true);
    setLoading(false);
  };
  return (
    <div className="absolute z-[99999] top-0 left-0 flex items-center justify-center w-screen h-screen text-white bg-white bg-opacity-10">
      <div className="p-8 rounded-md bg-spotifybg w-[500px] ">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Edit details</h1>
          <div
            className="p-2 rounded-full hover:bg-lightgray"
            onClick={() => {
              // console.log("toggleing");
              setToggleEdit(false);
            }}
          >
            <IoMdClose className="w-6 h-6" />
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <label
              htmlFor="playlistThumbnail"
              className="font-bold w-[180px] h-[180px] bg-spotifybg shadow-primary-shadow flex justify-center items-center rounded-md overflow-hidden"
            >
              {imageSrc !== "" ? (
                <img className="w-full h-full" src={imageSrc} alt="" />
              ) : (
                <FiMusic className="w-12 h-12" />
              )}
            </label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files.length !== 0) {
                  handleFileChange(e);
                  setSelectedThumbnail(e.target.files[0]);
                }
              }}
              name=""
              id="playlistThumbnail"
              className="mt-2"
              accept={".png,.jpg,.jpeg"}
              required
              hidden
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="relative">
              <label
                htmlFor="playlistname"
                className={`absolute text-sm font-bold left-2 top-[-4px] bg-lightgray`}
              >
                Name
              </label>
              <input
                onFocus={() => {
                  setClickedName(true);
                }}
                onBlur={() => {
                  setClickedName(false);
                }}
                className={`w-full px-4 py-2 mt-2 mb-4 rounded-md outline-none border-[1px]  ${
                  clickedName
                    ? "border-lightgray bg-spotifybg"
                    : "bg-lightgray border-transparent"
                }`}
                placeholder="Name of Playlist"
                type="text"
                name=""
                value={playlistname}
                onChange={(e) => {
                  setPlaylistName(e.target.value);
                }}
                id="playlistname"
                required
              />
            </div>
            <div className="relative">
              <label
                htmlFor="playlistname"
                className={`absolute text-sm font-bold left-2 top-[-4px] bg-lightgray`}
              >
                Desc
              </label>
              <textarea
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                value={desc}
                onFocus={() => {
                  setClickedDesc(true);
                }}
                onBlur={() => {
                  setClickedDesc(false);
                }}
                name=""
                id=""
                className={`w-full h-[7rem] px-4 py-2 mt-2 mb-4 rounded-md border-[1px] outline-none ${
                  clickedDesc
                    ? "border-lightgray bg-spotifybg"
                    : "bg-lightgray border-transparent"
                }`}
              ></textarea>
            </div>
            <div className="flex justify-end w-full">
              <button
                onClick={editPlaylist}
                className="px-6 py-1 w-fit font-bold hover:scale-[1.1] bg-white text-black text-center"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePlaylistModal;
