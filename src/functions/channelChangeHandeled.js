export const channelChangeHandeler = (direction, tvChannels, currentChannelId, setCurrentChannelId, setCurrentChannel) => {
    if (!tvChannels || tvChannels.length === 0) return; // If no channels, do nothing
  
    const currentIndex = tvChannels.findIndex(
      (channel) => channel.id === currentChannelId
    );
  
    if (direction === "next") {
      console.log("next");
  
      const nextIndex = (currentIndex + 1) % tvChannels.length; // Loop to the first channel if at the last one
      setCurrentChannelId(tvChannels[nextIndex].id);
      setCurrentChannel(tvChannels[nextIndex]);
      sessionStorage.setItem("currentchannel", JSON.stringify(tvChannels[nextIndex]));
      console.log("current channel is", tvChannels[nextIndex]);
    } else if (direction === "prev") {
      const prevIndex =
        (currentIndex - 1 + tvChannels.length) % tvChannels.length; // Loop to the last channel if at the first one
      setCurrentChannelId(tvChannels[prevIndex].id);
      setCurrentChannel(tvChannels[prevIndex]);
      sessionStorage.setItem("currentchannel", JSON.stringify(tvChannels[prevIndex]));
      console.log("current channel is", tvChannels[prevIndex]);
    }
  };
  