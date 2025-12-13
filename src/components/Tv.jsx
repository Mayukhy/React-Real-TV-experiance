import React, { useEffect, useState, useCallback, useMemo } from "react";
import Remote from "./Remote";
import QRCodeModal from "./QRCodeModal";
import { useNavigate, useParams } from "react-router-dom";
import { useTvCustomHook } from "../hooks/useTvCustomHook";

export default function Tv() {
  const params = useParams();
  const [chNoactiveClass, setChNoactiveClass] = useState("flex");
  const [showQRModal, setShowQRModal] = useState(false);
  const [tvId, setTvId] = useState('');
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
  } = useTvCustomHook();

  useEffect(() => {
    sessionStorage.setItem("powerState", JSON.stringify(isOn));
    if (!isOn) {
      document.body.style.backgroundImage = "radial-gradient(#1c1616, #0e0000)";
    } else
      document.body.style.backgroundImage = "radial-gradient(#da7878, #5b0f0f)";
    }, [isOn]);
    
  useEffect(() => {
    sessionStorage.setItem("allchannels", JSON.stringify(allTvChannels));
  }, []);
  
  // Generate or retrieve TV ID
  useEffect(() => {
    let storedTvId = sessionStorage.getItem('tvId');
    if (!storedTvId) {
      // Generate a unique TV ID
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substr(2, 5);
      storedTvId = `TV-${timestamp}-${randomStr}`.toUpperCase();
      sessionStorage.setItem('tvId', storedTvId);
    }
    setTvId(storedTvId);
    
    // Listen for remote validation events
    const handleRemoteValidated = (event) => {
      console.log('Remote validated, closing QR modal:', event.detail);
      setShowQRModal(false);
    };
    
    window.addEventListener('remoteValidated', handleRemoteValidated);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('remoteValidated', handleRemoteValidated);
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
      return
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
  },[sessionStorage.getItem("currentchannel")]);

  useEffect(() => {
    setTimeout(() => {
      navigate(`/channel/${tvChannels[0]?.channelNo}`);
    }, 1000);
  },[currentCategoryvalue, tvChannels])

  // Memoize filtered channels for current category
  const filteredChannels = useMemo(() => {
    return currentCategoryvalue === "All"
      ? tvChannels
      : tvChannels.filter(channel => channel?.category === currentCategoryvalue);
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

  //channel changing function using channel up down buttons
  const channelChangeHandeler = useCallback((direction) => {
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
        (currentIndex - 1 + filteredChannels.length) % filteredChannels.length; // Loop to the last channel if at the first one
      const prevChannel = filteredChannels[prevIndex];

      setCurrentChannelId(prevChannel?.id);
      setCurrentChannel(prevChannel);
      sessionStorage.setItem("currentchannel", JSON.stringify(prevChannel));
      navigate(`/channel/${prevChannel?.channelNo}`); // Use the channel number for navigation
    }
  }, [filteredChannels, currentChannelId, setCurrentChannelId, setCurrentChannel]);

  return (
    <div>
      <div className="tv">
        {/* QR Code Button - positioned at top right of screen */}
        <button
          onClick={handleShowQRCode}
          className="absolute top-2 right-2 z-20 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg transition-colors"
          title="Show QR Code for Remote Access"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </button>

        <div
          style={{ transform: "translate(-50%,-50%)" }}
          className="television-container rounded-2xl absolute top-[50%] left-[50%]"
        >
          <div className="antenna-container">
            <div className="antenna"></div>
          </div>
          <div className="television">
            <div className="television-inner">
              <div className="television-screen-container">
                <div className="television-crt">
                  <div className="television-screen relative w-full h-full">
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
                          className={`absolute right-0 m-4 font-semibold text-green-400 text-2xl z-10 ${chNoactiveClass}`}
                        >
                          {currentChannel?.channelNo.toString().split("")
                            .length === 2
                            ? currentChannel?.channelNo
                            : `0` + currentChannel?.channelNo}
                        </div>
                        <div className="h-full w-full flex justify-center items-center relative">
                          <video
                            autoPlay
                            loop
                            className="absolute inset-0 object-cover w-full h-full"
                            src={`/channels/ved${currentChannel?.channelNo}.mp4`}
                          ></video>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="television-lateral">
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
