import React, { useMemo } from "react";
import { Icon } from "@iconify/react";

function IconText({ iconName, displayText, active }) {
  const icon = useMemo(() => {
    return <Icon icon={iconName} className="w-[30px] h-[30px]" />;
  }, []);
  return (
    <div>
      <div className="pl-2">
        {" "}
        <div
          className={`flex w-full px-4 py-2 items-center gap-4 font-bold
          }`}
        >
          {icon}
          {displayText}
        </div>
      </div>
    </div>
  );
}

export default IconText;
