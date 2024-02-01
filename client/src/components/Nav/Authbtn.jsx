import React from "react";

function Authbtn({ whitebtn, width, bordered, displayText }) {
  return (
    <button
      className={`${
        whitebtn ? "bg-white text-black" : "text-gray-400 hover:text-white"
      } font-bold hover:scale-105 w-[${width}] h-[45px] pb-[2px] rounded-full`}
    >
      {displayText}
    </button>
  );
}

function Otherbtn({ icon, text, bg, textcolor }) {}

export default Authbtn;
