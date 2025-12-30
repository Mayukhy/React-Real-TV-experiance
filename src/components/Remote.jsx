import { Tooltip } from "@mui/joy";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import ChannelCategory from "./ChannelCategory";
import CategoryIcon from "@mui/icons-material/Category";
import { useTvCustomHook } from "../hooks/useTvCustomHook";

export default function Remote({ channelChangeHandeler, tvStateHandeler }) {
  const { numbtns, tvChannels, isCateOn, setIsCateOn, isOn, setNumInput, allTvChannels } =
    useTvCustomHook();
  const [numArr, setNumArr] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const [redirectTimer, setRedirectTimer] = useState(null);

  const setChannelNo = useCallback((no) => {
    const updatedNumArr = [...numArr, no];
    const channelNo = updatedNumArr.join("");
    console.log(channelNo);
    
    // Allow up to 3 digits
    if (channelNo.length > 3) return;

    setNumArr(updatedNumArr);
    setNumInput(channelNo);

    // Clear existing timers
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }

    const navigateToChannel = () => {
      const isPresent = tvChannels.some(channel => channel.id === `id_${channelNo}`);
      if (!isPresent) {
        resetInput();
        return;
      }
      if (channelNo <= allTvChannels.length) {
        navigate(`/channel/${channelNo}`);
      } else {
        navigate(`/channel/${tvChannels?.length}`);
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
  }, [numArr, tvChannels.length, navigate, redirectTimer, setNumInput]);

  return (
    <div className="fixed bottom-0 right-0 mr-60 z-50">
      {/* Hide remote on mobile/tablet screens */}
      <div className="hidden lg:block">
        {/* Hover trigger area - positioned at bottom */}
        <div 
          className="absolute bottom-0 left-0 w-full h-8 bg-transparent cursor-pointer z-40"
          onMouseEnter={() => setIsHovered(true)}
        />
        
        {/* Remote container with slide from bottom animation */}
        <div 
          className={`
            transition-transform duration-500 ease-out
            ${isHovered ? 'transform-none' : 'transform translate-y-[300px]'}
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`
            bg-gradient-to-b from-gray-800 via-gray-900 to-black
            rounded-t-xl border-2 border-gray-600
            w-[130px] h-[400px] p-3 relative
            shadow-2xl transform transition-all duration-300
            ${isHovered ? 'shadow-cyan-500/20 scale-105' : ''}
          `}>
            {/* Retro LED indicator */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full opacity-80"></div>
            
            {/* Category Modal - preserve original positioning */}
            {isCateOn && (
              <div className="absolute -top-4 left-0 z-60">
                <ChannelCategory />
              </div>
            )}
            
            {/* Power Button - Enhanced */}
            <button
              onClick={tvStateHandeler}
              className={`
                relative m-2 border-2 transition-all duration-200 w-[30px] h-[30px] rounded-full
                ${isOn 
                  ? 'bg-gradient-to-t from-red-600 to-red-400 border-red-300 shadow-lg shadow-red-500/40' 
                  : 'bg-gradient-to-t from-gray-600 to-gray-400 border-gray-400'
                }
                hover:scale-110 active:scale-95
              `}
            >
              <div className="absolute inset-0.5 rounded-full bg-gradient-to-t from-transparent to-white/20"></div>
            </button>
            
            {/* Category Button - Enhanced */}
            <Tooltip variant="outlined" title={isOn ? "Choose category" : ""}>
              <button
                className={`
                  border border-gray-500 px-2 py-1 rounded-md flex justify-center items-center mx-auto mb-2
                  bg-gradient-to-t from-gray-700 to-gray-600 transition-all duration-200
                  hover:from-cyan-700 hover:to-cyan-600 hover:border-cyan-400
                  ${isOn
                    ? "cursor-pointer opacity-100 hover:shadow-md hover:shadow-cyan-500/30"
                    : "cursor-not-allowed opacity-50"
                  }
                `}
                onClick={() => {
                  if (isOn) {
                    setIsCateOn(true);
                  }
                }}
              >
                <CategoryIcon className="scale-75 text-white" />
                <p className="text-xs text-white font-medium">Category</p>
              </button>
            </Tooltip>
            
            {/* Number Buttons - Enhanced Grid */}
            <div className="grid grid-cols-3 gap-1.5 m-1 mb-3">
              {numbtns?.map((itm, idx) => (
                <button
                  key={idx}
                  className={`
                    relative w-8 h-8 rounded-md transition-all duration-150 text-white font-bold text-sm
                    bg-gradient-to-t from-gray-700 via-gray-600 to-gray-500 border border-gray-400
                    hover:from-orange-600 hover:via-orange-500 hover:to-orange-400 hover:border-orange-300
                    hover:shadow-md hover:shadow-orange-500/30 active:scale-95
                    ${isOn
                      ? "cursor-pointer opacity-100"
                      : "cursor-not-allowed opacity-50"
                    }
                  `}
                  disabled={isOn ? false : true}
                  onClick={() => setChannelNo(itm)}
                >
                  <div className="absolute inset-0.5 rounded-sm bg-gradient-to-t from-transparent to-white/10"></div>
                  <span className="relative z-10">{itm}</span>
                </button>
              ))}
            </div>
            
            {/* Channel Control Buttons - Enhanced with better spacing */}
            <div className="flex flex-col justify-center items-center gap-3 mt-2">
              <Tooltip title={isOn ? "Next Channel" : ""} variant="outlined">
                <button
                  disabled={isOn ? false : true}
                  onClick={() => channelChangeHandeler("next")}
                  className={`
                    relative p-2 w-12 h-12 rounded-full transition-all duration-200
                    bg-gradient-to-t from-blue-700 via-blue-600 to-blue-500 border-2 border-blue-400
                    hover:from-cyan-600 hover:via-cyan-500 hover:to-cyan-400 hover:border-cyan-300
                    hover:shadow-lg hover:shadow-cyan-500/40 active:scale-95
                    ${isOn
                      ? "cursor-pointer opacity-100"
                      : "cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  <div className="absolute inset-1 rounded-full bg-gradient-to-t from-transparent to-white/15"></div>
                  <svg
                    className="relative z-10 w-6 h-6 text-white"
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
              
              <Tooltip title={isOn ? "Prev Channel" : ""} variant="outlined">
                <button
                  disabled={isOn ? false : true}
                  onClick={() => channelChangeHandeler("prev")}
                  className={`
                    relative p-2 w-12 h-12 rounded-full transition-all duration-200
                    bg-gradient-to-t from-blue-700 via-blue-600 to-blue-500 border-2 border-blue-400
                    hover:from-cyan-600 hover:via-cyan-500 hover:to-cyan-400 hover:border-cyan-300
                    hover:shadow-lg hover:shadow-cyan-500/40 active:scale-95
                    ${isOn
                      ? "cursor-pointer opacity-100"
                      : "cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  <div className="absolute inset-1 rounded-full bg-gradient-to-t from-transparent to-white/15"></div>
                  <svg
                    className="relative z-10 w-6 h-6 text-white"
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
            
            {/* Retro Brand Label - moved up slightly */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <span className="text-gray-400 text-xs font-mono tracking-wide">RETRO-TV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Remote.propTypes = {
  channelChangeHandeler: PropTypes.func.isRequired,
  tvStateHandeler: PropTypes.func.isRequired,
};
