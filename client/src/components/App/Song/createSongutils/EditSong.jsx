import React from "react";
import { IoMdClose } from "react-icons/io";
import Choosebtn from "./Choosebtn";

function songEdit({
  hidden,
  setHidden,
  imageurl,
  songname,
  SetSongname,
  originalsongname,
  handleImageChange,
  setSelectedSong,
  setUploadClicked,
  saveData,
}) {
  return (
    <div
      className={`${
        hidden ? "hidden " : ""
      }absolute left-0 top-0 songdetailcontainer bg-darkgray bg-opacity-80 flex justify-center items-center text-white w-screen h-screen rounded-md z-[9999] overflow-hidden p-4`}
      // style={{
      //   boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      //   transform: "translate3d(-50%, -50%, 0px)",
      // }}
    >
      <div className="relative p-8 w-fit bg-darkgray">
        <div
          className="absolute z-[10000] right-0 top-0 text-white p-2 hover:bg-lightgray rounded-full"
          onClick={setHidden}
        >
          <IoMdClose className="w-[25px] h-[25px]" />
        </div>
        <div className="flex items-center gap-4">
          <label
            htmlFor="image_file"
            className="songthumbanil w-[150px] h-[150px] inline-block"
          >
            <img
              className="w-[150px] h-[150px]"
              src={imageurl}
              alt=""
              style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            />
          </label>
          <div className="flex flex-col gap-2">
            <Choosebtn
              displaytext={"Choose Image"}
              id={"image_file"}
              fileType={".png,.jpg,.jpeg"}
              setFunction={handleImageChange}
            />
            <Choosebtn
              displaytext={"Choose Song"}
              id={"song_file"}
              fileType={".mp3,.wav"}
              setFunction={setSelectedSong}
            />
            <input
              type="text"
              className="filename border-[1px] p-2 w-[180px] leading-3 rounded-md bg-transparent outline-none"
              readOnly
              value={originalsongname ? originalsongname : "song_name.mp3/.wav"}
            ></input>
          </div>
        </div>
        <div className="mt-8 songname ">
          <label htmlFor="song_name" className="mt-2 font-bold">
            Song Name
          </label>
          <input
            type="text"
            autoComplete="off"
            name="song"
            id="song_name"
            placeholder="#songname"
            className="w-full px-2 py-1 text-black bg-white border-none rounded-sm outline-none"
            value={songname}
            onChange={(e) => {
              SetSongname(e.target.value);
            }}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              setHidden();
              setUploadClicked(true);
              saveData();
            }}
            className="px-6 py-2 text-sm font-bold text-black bg-white rounded-sm cursor-pointer h-fit hover:scale-105"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default songEdit;
