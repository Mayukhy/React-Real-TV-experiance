import { Tooltip } from "@mui/joy";
import React, { useState } from "react";
import useTvCustomHook from "../hooks/useTvCustomHook";
import { useNavigate } from "react-router-dom";

export default function Remote({ channelChangeHandeler, tvStateHandeler, isOn, setNumInput }) {
  const { numbtns, tvChannels } = useTvCustomHook()
  const [numArr, setNumArr] = useState([])
  const navigate = useNavigate()
  const [redirectTimer, setRedirectTimer] = useState(null);

  const setChannelNo = (no) => {
    const updatedNumArr = [...numArr, no];
    const channelNo = updatedNumArr.join("");

    // Allow up to 3 digits
    if (channelNo.length > 3) return;

    setNumArr(updatedNumArr);
    setNumInput(channelNo);

    // Clear existing timers
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }

    const navigateToChannel = () => {
      if (channelNo <= tvChannels.length) {
        navigate(`/channel/${channelNo}`);
      }
      else {
        navigate(`/channel/${tvChannels?.length}`)
      }
      resetInput();
    };

    const resetInput = () => {
      setNumArr([]);
      setNumInput("");
    };

    if (channelNo.length >= 2) {
      // Redirect after 3 seconds for 2 or 3 digits
      setRedirectTimer(setTimeout(navigateToChannel, 3000));
    } else if (channelNo.length === 1) {
      // Redirect after 3 seconds for 1 digit
      setRedirectTimer(setTimeout(navigateToChannel, 3000));
    }
  };


  return (
    <div className=" bg-white z-50 rounded-t-xl absolute bottom-0 right-0 mr-60 w-[100px] h-[280px] border border-zinc-500">
      {/* tv on/off button  */}
      <button
        onClick={tvStateHandeler}
        className=" bg-rose-700 m-2 border border-transparent transition-all divide-neutral-300 hover:bg-rose-400 hover:border-red-700 w-[27px] h-[27px] rounded-full"></button>
      {/* number buttons  */}
      <div className=" grid grid-cols-3 gap-1 m-1">
        {numbtns?.map((itm, idx) => (
          <button
          disabled={isOn ? false : true}
          key={idx} onClick={() => setChannelNo(itm)}>{itm}</button>
        ))}
      </div>
      {/* channel ud down buttons  */}
      <div className=" flex flex-col justify-center items-center gap-2">
        <Tooltip title={isOn ? "Next Channel" : ""} variant="outlined">
          <button
            disabled={isOn ? false : true}
            onClick={() => channelChangeHandeler("next")}
            className=" p-1 border rounded-full border-zinc-600 hover:text-zinc-100 hover:bg-zinc-800 transition-all duration-200">
            <svg
              width="35"
              height="35"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.18179 8.81819C4.00605 8.64245 4.00605 8.35753 4.18179 8.18179L7.18179 5.18179C7.26618 5.0974 7.38064 5.04999 7.49999 5.04999C7.61933 5.04999 7.73379 5.0974 7.81819 5.18179L10.8182 8.18179C10.9939 8.35753 10.9939 8.64245 10.8182 8.81819C10.6424 8.99392 10.3575 8.99392 10.1818 8.81819L7.49999 6.13638L4.81819 8.81819C4.64245 8.99392 4.35753 8.99392 4.18179 8.81819Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </Tooltip>
        <Tooltip
          title={isOn ? "Prev Channel" : ""} variant="outlined">
          <button
            disabled={isOn ? false : true}
            onClick={() => channelChangeHandeler("prev")}
            className=" p-1 border rounded-full hover:text-zinc-100 hover:bg-zinc-800 transition-all duration-200 border-zinc-600">
            <svg
              width="35"
              height="35"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
