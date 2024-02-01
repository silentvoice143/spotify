import React from "react";
import { Icon } from "@iconify/react";

function IconText({ iconName, displayText, active }) {
  return (
    <div>
      <div className="">
        {" "}
        <div
          className={`flex w-full px-4 py-2 items-center gap-4 font-bold
          }`}
        >
          <Icon icon={iconName} className="w-[30px] h-[30px]" />
          {displayText}
        </div>
      </div>
    </div>
  );
}

export default IconText;
