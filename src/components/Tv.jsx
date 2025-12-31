import { useEffect, useState, useCallback, useMemo } from "react";
import Remote from "./Remote";
import QRCodeModal from "./QRCodeModal";
import { useNavigate, useParams } from "react-router-dom";
import { useTvCustomHook } from "../hooks/useTvCustomHook";

export default function Tv() {
  const params = useParams();
  const [chNoactiveClass, setChNoactiveClass] = useState("flex");
  const [showQRModal, setShowQRModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [tvId, setTvId] = useState("");

  const navigate = useNavigate();
  const {
    isOn,
    setIsOn,
    tvChannels,
    currentChannel,
    setCurrentChannel,
    currentChannelId,
    setCurrentChannelId,
    numInput,
    currentCategoryvalue,
    allTvChannels,
    // bugData
  } = useTvCustomHook();

  useEffect(() => {
    sessionStorage.setItem("powerState", JSON.stringify(isOn));

    // Add fade animation classes and transition for smooth background changes
    document.body.style.transition = "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
    // document.body.classList.add('background-fade');

    // Add keyframe animations if not already added
    if (!document.getElementById("background-animations")) {
      const style = document.createElement("style");
      style.id = "background-animations";
      style.textContent = `
        .wrapped-background {
          overflow-x: hidden;
          transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        
        .upside-down-tv {
          animation: eerie-glow 2s infinite alternate;
        }
        
        .upside-down-crt {
          box-shadow: inset 0 0 100px rgba(139, 0, 0, 0.3), 
                      0 0 50px rgba(139, 0, 0, 0.5);
          border: 2px solid rgba(139, 0, 0, 0.6);
        }
        
        @keyframes eerie-glow {
          0% { 
            filter: drop-shadow(0 0 20px rgba(139, 0, 0, 0.6)) 
                    drop-shadow(0 0 40px rgba(139, 0, 0, 0.3));
          }
          100% { 
            filter: drop-shadow(0 0 40px rgba(139, 0, 0, 0.9)) 
                    drop-shadow(0 0 80px rgba(139, 0, 0, 0.6));
          }
        }
        
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 1;
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.4;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Remove previous animation classes
    document.body.classList.remove("wrapped-background");

    if (!isOn) {
      document.body.style.backgroundImage = "radial-gradient(#1c1616, #0e0000)";
    } else if (isOn && currentCategoryvalue !== "2025 Wrapped") {
      document.body.style.backgroundImage = "radial-gradient(#da7878, #5b0f0f)";
    } else {
      document.body.classList.add("wrapped-background");
    }

    // Trigger reflow to restart animation
    document.body.offsetHeight;
  }, [isOn, currentCategoryvalue]);

  useEffect(() => {
    sessionStorage.setItem("allchannels", JSON.stringify(allTvChannels));
  }, []);

  // Update background when currentWrappedBackground changes
  useEffect(() => {
    if (isOn && currentCategoryvalue === "2025 Wrapped") {
      document.body.classList.add("wrapped-background");
      document.body.style.backgroundImage = `url('${currentChannel?.background}')`;
    }
  }, [isOn, currentCategoryvalue, currentChannel]);

  // Generate or retrieve TV ID
  useEffect(() => {
    let storedTvId = sessionStorage.getItem("tvId");
    if (!storedTvId) {
      // Generate a unique TV ID
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substr(2, 5);
      storedTvId = `TV-${timestamp}-${randomStr}`.toUpperCase();
      sessionStorage.setItem("tvId", storedTvId);
    }
    setTvId(storedTvId);

    // Listen for remote validation events
    const handleRemoteValidated = (event) => {
      console.log("Remote validated, closing QR modal:", event.detail);
      setShowQRModal(false);
    };

    window.addEventListener("remoteValidated", handleRemoteValidated);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("remoteValidated", handleRemoteValidated);
    };
  }, []);

  useEffect(() => {
    if (!params?.id || !tvChannels || tvChannels.length === 0) return;

    const channelNo = Number(params.id);

    // Validate the `id` parameter and navigate if necessary
    if (channelNo === 0) {
      navigate(`/channel/1`);
      return;
    }

    if (channelNo > tvChannels.length && currentCategoryvalue === "All") {
      navigate(`/channel/${tvChannels.length}`);
      return;
    }

    // Find the current channel and update state
    const currentIndex = tvChannels.findIndex(
      (channel) => channel?.channelNo === channelNo
    );

    if (currentIndex !== -1) {
      setCurrentChannelId(tvChannels[currentIndex].id);
      setCurrentChannel(tvChannels[currentIndex]);
      sessionStorage.setItem(
        "currentchannel",
        JSON.stringify(tvChannels[currentIndex])
      );
    } else {
      return;
    }
  }, [params?.id]);

  useEffect(() => {
    setChNoactiveClass("flex");
    setTimeout(() => {
      setChNoactiveClass("hidden");
    }, 3000);
    return () => {
      setChNoactiveClass("flex");
      clearTimeout(3000);
    };
  }, [params?.id]);

  useEffect(() => {
    navigate(`/channel/${currentChannel?.channelNo}`);
  }, [sessionStorage.getItem("currentchannel")]);

  useEffect(() => {
    if (currentCategoryvalue !== "All") {
      setTimeout(() => {
        navigate(`/channel/${tvChannels[0]?.channelNo}`);
      }, 1000);
      return () => clearTimeout();
    }
  }, [tvChannels]);

  // Memoize filtered channels for current category
  const filteredChannels = useMemo(() => {
    return currentCategoryvalue === "All"
      ? tvChannels
      : tvChannels.filter(
          (channel) => channel?.category === currentCategoryvalue
        );
  }, [tvChannels, currentCategoryvalue]);

  // handle the tv's on off state
  const tvStateHandeler = useCallback(() => {
    setIsOn(!isOn);
    if (isOn) {
      document.body.style.backgroundImage = "radial-gradient(#1c1616, #0e0000)";
    } else
      document.body.style.backgroundImage = "radial-gradient(#da7878, #5b0f0f)";
  }, [isOn]);

  // Handle QR code modal
  const handleShowQRCode = useCallback(() => {
    setShowQRModal(true);
  }, []);

  const handleCloseQRModal = useCallback(() => {
    setShowQRModal(false);
  }, []);

  // Handle instructions modal
  const handleShowInstructions = useCallback(() => {
    setShowInstructions(true);
  }, []);

  const handleCloseInstructions = useCallback(() => {
    setShowInstructions(false);
  }, []);

  //channel changing function using channel up down buttons
  const channelChangeHandeler = useCallback(
    (direction) => {
      if (!filteredChannels || filteredChannels.length === 0) return; // If no channels, do nothing

      if (filteredChannels.length === 0) {
        console.error("No channels found for the selected category");
        return; // Exit if no channels match the filter
      }

      // Find the current index in the appropriate array
      const currentIndex = filteredChannels.findIndex(
        (channel) => channel.id === currentChannelId
      );

      if (currentIndex === -1) {
        console.error("Current channel not found in the filtered list");
        return; // Exit if the current channel is not found
      }

      if (direction === "next") {
        const nextIndex = (currentIndex + 1) % filteredChannels.length; // Loop to the first channel if at the last one
        const nextChannel = filteredChannels[nextIndex];

        setCurrentChannelId(nextChannel?.id);
        setCurrentChannel(nextChannel);
        sessionStorage.setItem("currentchannel", JSON.stringify(nextChannel));
        navigate(`/channel/${nextChannel?.channelNo}`); // Use the channel number for navigation
      } else if (direction === "prev") {
        const prevIndex =
          (currentIndex - 1 + filteredChannels.length) %
          filteredChannels.length; // Loop to the last channel if at the first one
        const prevChannel = filteredChannels[prevIndex];

        setCurrentChannelId(prevChannel?.id);
        setCurrentChannel(prevChannel);
        sessionStorage.setItem("currentchannel", JSON.stringify(prevChannel));
        navigate(`/channel/${prevChannel?.channelNo}`); // Use the channel number for navigation
      }
    },
    [filteredChannels, currentChannelId, setCurrentChannelId, setCurrentChannel]
  );

  const showChannelData = useCallback(() => {
    if (!currentChannel) return;
    // Logic to display channel data on the TV screen
    switch (currentChannel.channelNo) {
      case 18:
        return "January Special";
      case 19:
        return "February Special";
      case 20:
        return "March Special";
      case 21:
        return "April Special";
      case 22:
        return "May Special";
      case 23:
        return "June Special";
      case 24:
        return "July Special";
      case 25:
        return "August Special";
      case 26:
        return "September Special";
      case 27:
        return "October Special";
      case 28:
        return "November Special";
      case 29:
        return "December Special";
      case 30:
        return "New Year's Eve";
      default:
        return `${
          currentChannel?.channelNo.toString().split("").length === 2
            ? currentChannel?.channelNo
            : `0` + currentChannel?.channelNo
        }`;
    }
  }, [currentChannel, numInput]);
  return (
    <div>
      <div className="tv">
        {/* {bugData && (
          <div className="absolute bottom-2 left-2 z-20 bg-red-800 bg-opacity-80 text-white px-3 py-2 rounded-lg shadow-lg max-w-s">
            <div className="text-sm font-mono">Bug Report: {bugData.message}</div>
          </div>
        )} */}
        {/* TV ID Display - positioned at top left of screen */}
        <div className="absolute top-2 left-2 z-20 bg-gray-800 bg-opacity-80 text-white px-3 py-2 rounded-lg shadow-lg">
          <div className="text-sm font-mono">TV ID: {tvId}</div>
        </div>

        {/* Instructions Button - positioned at top right left of QR button */}
        <button
          onClick={handleShowInstructions}
          className="absolute top-4 right-[150px] z-20 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-400/50"
          title="How to Connect Remote"
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold hidden sm:block">Help</span>
          </div>
        </button>

        {/* QR Code Button - positioned at top right of screen */}
        <button
          onClick={handleShowQRCode}
          className="absolute top-4 right-4 z-20 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-400/50 ring-2 ring-blue-300 ring-opacity-50"
          title="Show QR Code for Remote Access"
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <span className="text-sm font-semibold hidden sm:block">
              QR Code
            </span>
          </div>
        </button>

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    Connect Your Remote
                  </h2>
                  <button
                    onClick={handleCloseInstructions}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      📱 Method: QR Code
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                      <li>
                        Click the{" "}
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                          QR
                        </span>{" "}
                        button (top right)
                      </li>
                      <li>Open camera app on your phone</li>
                      <li>Scan the QR code displayed</li>
                      <li>Open the remote control link</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      ✨ Features
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                      <li>Control TV power on/off</li>
                      <li>Change channels up/down</li>
                      <li>Switch between categories</li>
                      <li>Real-time synchronization</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <h3 className="font-semibold text-red-800 mb-2">
                      ⚠️ Troubleshooting
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                      <li>Ensure same WiFi network</li>
                      <li>Check TV ID matches exactly</li>
                      <li>Refresh remote app if needed</li>
                      <li>Try scanning QR code again</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleCloseInstructions}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Got It!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          style={{ 
            transform: currentChannel?.channelNo === 30 
              ? "translate(-50%,-50%) scale(1.08)"
              : "translate(-50%,-50%)",
            transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: currentChannel?.channelNo === 30 
              ? "drop-shadow(0 0 30px rgba(139, 0, 0, 0.8)) drop-shadow(0 0 60px rgba(139, 0, 0, 0.4))" 
              : "none"
          }}
          className={`television-container rounded-2xl absolute top-[50%] left-[50%] ${
            currentChannel?.channelNo === 30 ? 'upside-down-tv animate-pulse' : ''
          }`}
        >
          <div className="antenna-container">
            <div className="antenna"></div>
          </div>
          <div className={`television ${ currentChannel?.channelNo === 30 ? "!w-[700px] !h-[500px]" : ""}`}>
            <div className={`television-inner ${ currentChannel?.channelNo === 30 ? "!grid-cols-[8fr_1fr] !grid-rows-[0.9fr]" : ""}`}>
              <div className="television-screen-container">
                <div className={`television-crt ${
                  currentChannel?.channelNo === 30 ? 'upside-down-crt' : ''
                }`}>
                  <div className={`television-screen relative w-full h-full ${
                    currentChannel?.channelNo === 30 ? 'upside-down-screen' : ''
                  }`}>
                    {/* only show this when tv is on  */}
                    {isOn && (
                      <>
                        <div className="absolute left-0 m-4 font-semibold text-green-400 text-2xl z-10">
                          {numInput &&
                            numInput.toString().split("").length === 1 && (
                              <>
                                <span className="text-green-500 font-extrabold">
                                  _
                                </span>
                                <span className="text-green-500 font-extrabold">
                                  _
                                </span>
                              </>
                            )}
                          {numInput &&
                            numInput.toString().split("").length === 2 && (
                              <span className="text-green-500 font-extrabold">
                                _
                              </span>
                            )}
                          {numInput}
                        </div>
                        <div
                          className={`absolute right-0 m-4 font-semibold ${currentChannel.channelNo === 30 ?"text-rose-500" : "text-green-400"} text-2xl z-10 ${chNoactiveClass}`}
                        >
                          {showChannelData()}
                        </div>
                        <div className="h-full w-full flex justify-center items-center relative">
                          {/* Special overlay for channel 30 */}
                          {currentChannel?.channelNo === 30 && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/20 to-black/40 z-10 animate-pulse"></div>
                              <div className="absolute inset-0 bg-red-900/10 z-10 opacity-60 animate-ping"></div>
                              <div className="absolute inset-0 z-10" 
                                   style={{
                                     background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 0, 0, 0.1) 2px, rgba(139, 0, 0, 0.1) 4px)',
                                     animation: 'flicker 0.15s infinite linear alternate'
                                   }}>
                              </div>
                            </>
                          )}
                          <video
                            autoPlay
                            loop
                            className={`absolute inset-0 object-cover w-full h-full ${
                              currentChannel?.channelNo === 30 
                                ? 'filter brightness-75 contrast-125 saturate-50 hue-rotate-15' 
                                : ''
                            }`}
                            style={{
                              transform: currentChannel?.channelNo === 30 ? 'scale(1.05)' : 'scale(1)',
                              transition: 'all 0.5s ease-in-out'
                            }}
                            src={
                              currentChannel.category === "2025 Wrapped"
                                ? currentChannel.videoUrl
                                : `/channels/ved${currentChannel?.channelNo}.mp4`
                            }
                          ></video>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={`television-lateral ${ currentChannel.channelNo === 30 ? "w-[50px]" : ""}`}>
                <div className="dial-container">
                  <div className="dial channel-button">
                    <div className="data-container">
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                    </div>
                    <div className="dial-core"></div>
                    <div className="selector"></div>
                  </div>
                  <div className="dial volume-button">
                    <div className="data-container">
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                      <div className="data">#</div>
                    </div>
                    <div className="dial-core"></div>
                    <div className="selector"></div>
                  </div>
                </div>
                <div className="speaker-container">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="buttons">
                <div className="button-container">
                  <div className="button"></div>
                </div>
                <div className="button-container">
                  <div className="button"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="television-base">
            <div className="slots">
              <div className="slot"></div>
              <div className="slot"></div>
              <div className="slot"></div>
            </div>
            <div className="slots">
              <div className="slot"></div>
              <div className="slot"></div>
              <div className="slot"></div>
              <div className="slot"></div>
              <div className="slot"></div>
              <div className="slot"></div>
            </div>
          </div>
        </div>
      </div>

      <Remote
        tvStateHandeler={tvStateHandeler}
        channelChangeHandeler={channelChangeHandeler}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={handleCloseQRModal}
        tvId={tvId}
      />
    </div>
  );
}
