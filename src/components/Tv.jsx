import React, { useEffect, useState } from "react";
import useTvCustomHook from "../hooks/useTvCustomHook";
import Remote from "./Remote";
import { useNavigate, useParams } from "react-router-dom";

export default function Tv() {
    const params = useParams()
    const [chNoactiveClass, setChNoactiveClass] = useState("flex")
    const navigate = useNavigate()
    const { isOn, setIsOn,
        tvChannels, currentChannel,
        setCurrentChannel, currentChannelId,
        setCurrentChannelId, numInput, setNumInput } =
        useTvCustomHook();

    // handle the tv's on off state
    const tvStateHandeler = () => {
        setIsOn(!isOn)
        if (isOn) {
            document.body.style.backgroundImage = "radial-gradient(#1c1616, #0e0000)";
        }
        else
            document.body.style.backgroundImage = "radial-gradient(#da7878, #5b0f0f)"
    }
    useEffect(() => {
        sessionStorage.setItem("powerState", JSON.stringify(isOn))
        if (!isOn) {
            document.body.style.backgroundImage = "radial-gradient(#1c1616, #0e0000)";
        }
        else
            document.body.style.backgroundImage = "radial-gradient(#da7878, #5b0f0f)"
    }, [isOn])

    //channel changing function using channel up down buttons 
    const channelChangeHandeler = (direction) => {

        if (!tvChannels || tvChannels.length === 0) return; // If no channels, do nothing

        const currentIndex = tvChannels.findIndex(
            (channel) => channel.id === currentChannelId
        );

        if (direction === "next") {
            console.log("next");
            const nextIndex = (currentIndex + 1) % tvChannels.length; // Loop to the first channel if at the last one
            setCurrentChannelId(tvChannels[nextIndex].id);
            setCurrentChannel(tvChannels[nextIndex]);
            sessionStorage.setItem("currentchannel", JSON.stringify(tvChannels[nextIndex]))
            navigate(`/channel/${nextIndex + 1}`)
            console.log("current channel is", currentChannel);
        } else if (direction === "prev") {
            const prevIndex =
                (currentIndex - 1 + tvChannels.length) % tvChannels.length; // Loop to the last channel if at the first one
            setCurrentChannelId(tvChannels[prevIndex].id);
            setCurrentChannel(tvChannels[prevIndex]);
            sessionStorage.setItem("currentchannel", JSON.stringify(tvChannels[prevIndex]))
            navigate(`/channel/${prevIndex + 1}`)
            console.log("current channel is", currentChannel);

        }
    };

    useEffect(() => {
        if (!params?.id || !tvChannels || tvChannels.length === 0) return;

        const channelNo = Number(params.id);
        console.log("channel no is", channelNo);

        // Validate the `id` parameter and navigate if necessary
        if (channelNo === 0) {
            navigate(`/channel/1`);
            return;
        }

        if (channelNo > tvChannels.length) {
            navigate(`/channel/${tvChannels.length}`);
            return;
        }

        // Find the current channel and update state
        const currentIndex = tvChannels.findIndex(
            (channel) => channel.channelNo === channelNo
        );

        if (currentIndex !== -1) {
            setCurrentChannelId(tvChannels[currentIndex].id);
            setCurrentChannel(tvChannels[currentIndex]);
            sessionStorage.setItem("currentchannel", JSON.stringify(tvChannels[currentIndex]));
        } else {
            console.error("Channel not found");
        }
    }, [params?.id, tvChannels]);

    useEffect(() => {
        setChNoactiveClass("flex")
        setTimeout(() => {
            setChNoactiveClass("hidden")
        }, 3000);
    }, [params?.id])

    return (
        <div>

            <div className="tv">
                <div
                    style={{ transform: "translate(-50%,-50%)" }}
                    className="television-container rounded-2xl absolute top-[50%] left-[50%]">
                    <div className="antenna-container">
                        <div className="antenna"></div>
                    </div>
                    <div className="television">
                        <div className="television-inner">
                            <div className="television-screen-container">
                                <div className="television-crt">

                                    <div className="television-screen relative w-full h-full">
                                        {/* only show this when tv is on  */}
                                        {isOn &&
                                            <>
                                                <div className="absolute left-0 m-4 font-semibold text-green-400 text-2xl z-10">
                                                    {numInput && numInput.toString().split("").length === 1 && (
                                                        <>
                                                            <span className="text-green-500 font-extrabold">_</span>
                                                            <span className="text-green-500 font-extrabold">_</span>
                                                        </>
                                                    )}
                                                    {numInput && numInput.toString().split("").length === 2 && (
                                                        <span className="text-green-500 font-extrabold">_</span>
                                                    )}
                                                    {numInput}
                                                </div>
                                                <div
                                                    className={`absolute right-0 m-4 font-semibold text-green-400 text-2xl z-10 ${chNoactiveClass}`}
                                                >
                                                    {currentChannel?.channelNo.toString().split("").length === 2
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
                                        }
                                    </div>


                                </div>
                            </div>
                            <div className="television-lateral">
                                <div className="dial-container">
                                    <div className="dial channel-button" >
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
                                    <div className="dial volume-button" >
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

            <Remote setNumInput={setNumInput} isOn={isOn} tvStateHandeler={tvStateHandeler} channelChangeHandeler={channelChangeHandeler} />
        </div>
    );
}
