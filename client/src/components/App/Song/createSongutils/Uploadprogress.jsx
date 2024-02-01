import React from "react";

function Uploadprogress({ uploadProgress, text }) {
  return (
    <div
      className={`relative flex justify-between px-2 w-[300px] pb-2  bg-spotify_green before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-2 before:w-[${
        uploadProgress + "%"
      }] before:bg-black`}
    >
      <p className="text-sm font-bold">uploading {text}...</p>
      <p className="text-sm font-bold">{uploadProgress}%</p>
    </div>
  );
}

export default Uploadprogress;
