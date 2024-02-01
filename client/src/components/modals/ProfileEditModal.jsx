import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useCookies } from "react-cookie";

function ProfileEditModal({ setToggleProfileEdit }) {
  const [cookies, setCookie] = useCookies(["token", "user"]);
  const [userName, setUserName] = useState(cookies.user.name);
  const [selectedthumbnail, setSelectedThumbnail] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [clickedName, setClickedName] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const editProfile = () => {
    return;
  };

  return (
    <div className="absolute z-[99999] top-0 left-0 flex flex-col items-center justify-center w-screen h-screen text-white bg-white bg-opacity-10">
      <div className="p-8 rounded-md bg-spotifybg w-[500px] ">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">Edit profile</h1>
          <div
            className="p-2 rounded-full hover:bg-lightgray"
            onClick={() => {
              console.log("toggleing");
              setToggleProfileEdit(false);
            }}
          >
            <IoMdClose className="w-6 h-6" />
          </div>
        </div>
        <div className="flex gap-8 mb-4">
          <div>
            <div
              onMouseOver={() => {
                setIsHovered(true);
              }}
              onMouseOut={() => {
                setIsHovered(false);
              }}
              htmlFor="playlistThumbnail"
              className="font-semibold w-[180px] h-[180px] bg-spotifybg shadow-primary-shadow flex justify-center items-center rounded-full overflow-hidden"
            >
              {imageSrc !== "" ? (
                <img className="w-full h-full" src={imageSrc} alt="" />
              ) : !isHovered ? (
                <IoPersonCircleOutline className="w-12 h-12" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm cursor-default hover:underline">
                    Choose Photo
                  </p>
                  <MdOutlineEdit className="w-12 h-12" />
                  <p className="text-sm cursor-default hover:underline">
                    Remove photo
                  </p>
                </div>
              )}
            </div>
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
            <div className="relative mt-8">
              <label
                htmlFor="playlistname"
                className={`absolute text-sm font-bold left-2 top-[-4px] bg-spotifybg`}
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
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                id="playlistname"
                required
              />
            </div>

            <div className="flex justify-end w-full">
              <button
                onClick={editProfile}
                className="px-6 py-1 w-fit font-bold hover:scale-[1.1] bg-white text-black text-center"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <p className="text-[0.7rem] font-semibold">
          By proceeding, you agree to give Spotify access to the image you
          choose to upload. Please make sure you have the right to upload the
          image.
        </p>
      </div>
    </div>
  );
}

export default ProfileEditModal;
