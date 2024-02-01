import React from "react";

function Choosebtn({ displaytext, id, fileType, setFunction }) {
  return (
    <label
      htmlFor={id}
      className="text-sm bg-white h-fit font-bold text-black px-4 py-2 rounded-full hover:scale-105 cursor-pointer"
    >
      <input
        type="file"
        onChange={setFunction}
        id={id}
        hidden
        accept={fileType}
        required
        className="hidden "
      />
      <p>{displaytext}</p>
    </label>
  );
}

export default Choosebtn;
