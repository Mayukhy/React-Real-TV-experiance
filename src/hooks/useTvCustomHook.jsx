import { useState, useEffect, useContext, createContext, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import tvWebSocketService from "../services/tvWebSocketService.js";

// Create Context
const TvContext = createContext();

//provider component
export const TvProvider = ({ children }) => {
  const session_current_channel = JSON.parse(
    sessionStorage.getItem("currentchannel")
  );
  const tvState = JSON.parse(sessionStorage.getItem("powerState"));
  const myCategories = JSON.parse(sessionStorage.getItem("mycategories"));
  const more_Categories = JSON.parse(sessionStorage.getItem("morecategories"));
  const categoryValue = JSON.parse(sessionStorage.getItem("categoryValue"));

  const [allTvChannels, setAllTvChannels] = useState([
    {
      id: "id_1",
      channelNo: 1,
      isplayimg: false,
      category: "Entertainment",
      videoUrl: "https://dummyurl.com/video1",
    },
    {
      id: "id_2",
      channelNo: 2,
      isplayimg: false,
      category: "Nature",
      videoUrl: "https://dummyurl.com/video2",
    },
    {
      id: "id_3",
      channelNo: 3,
      isplayimg: false,
      category: "Nature",
      videoUrl: "https://dummyurl.com/video3",
    },
    {
      id: "id_4",
      channelNo: 4,
      isplayimg: false,
      category: "Animal",
      videoUrl: "https://dummyurl.com/video4",
    },
    {
      id: "id_5",
      channelNo: 5,
      isplayimg: false,
      category: "Animal",
      videoUrl: "https://dummyurl.com/video5",
    },
    {
      id: "id_6",
      channelNo: 6,
      isplayimg: false,
      category: "Horror",
      videoUrl: "https://dummyurl.com/video6",
    },
    {
      id: "id_7",
      channelNo: 7,
      isplayimg: false,
      category: "Horror",
      videoUrl: "https://dummyurl.com/video7",
    },
    {
      id: "id_8",
      channelNo: 8,
      isplayimg: false,
      category: "Horror",
      videoUrl: "https://dummyurl.com/video8",
    },
    {
      id: "id_9",
      channelNo: 9,
      isplayimg: false,
      category: "Horror",
      videoUrl: "https://dummyurl.com/video9",
    },
    {
      id: "id_10",
      channelNo: 10,
      isplayimg: false,
      category: "Horror",
      videoUrl: "https://dummyurl.com/video10",
    },
    {
      id: "id_11",
      channelNo: 11,
      isplayimg: false,
      category: "Romance",
      videoUrl: "https://dummyurl.com/video11",
    },
    {
      id: "id_12",
      channelNo: 12,
      isplayimg: false,
      category: "Romance",
      videoUrl: "https://dummyurl.com/video12",
    },
    {
      id: "id_13",
      channelNo: 13,
      isplayimg: false,
      category: "Animal",
      videoUrl: "https://dummyurl.com/video13",
    },
    {
      id: "id_14",
      channelNo: 14,
      isplayimg: false,
      category: "Nature",
      videoUrl: "https://dummyurl.com/video14",
    },
    {
      id: "id_15",
      channelNo: 15,
      isplayimg: false,
      category: "Romance",
      videoUrl: "https://dummyurl.com/video15",
    },
    {
      id: "id_16",
      channelNo: 16,
      isplayimg: false,
      category: "Animal",
      videoUrl: "https://dummyurl.com/video16",
    },
    {
      id: "id_17",
      channelNo: 17,
      isplayimg: false,
      category: "Nature",
      videoUrl: "https://dummyurl.com/video17",
    },
    {
      id: "id_18",
      channelNo: 18,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092782/jan_uqkfpw.mp4",
      background: "/bgs/jan.png"
    },
    {
      id: "id_19",
      channelNo: 19,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092774/feb_jjxixe.mp4",
      background: "/bgs/feb.png"
    },
    {
      id: "id_20",
      channelNo: 20,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092790/march_dszonu.mp4",
      background: "/bgs/mar.jpg"
    },
    {
      id: "id_21",
      channelNo: 21,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092724/april_qcca89.mp4",
      background: "/bgs/april.webp"
    },
    {
      id: "id_22",
      channelNo: 22,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092820/may_zqkvpa.mp4",
      background: "/bgs/may.gif"
    },
    {
      id: "id_23",
      channelNo: 23,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092801/june_mmwbrr.mp4",
      background: "/bgs/june.jpg"
    },
    {
      id: "id_24",
      channelNo: 24,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092765/july_nqr3fg.mp4",
      background: "/bgs/july.gif"
    },
    {
      id: "id_25",
      channelNo: 25,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092789/aug_rddz0l.mp4",
      background: "/bgs/aug.gif"
    },
    {
      id: "id_26",
      channelNo: 26,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092808/sept_au5xvw.mp4",
      background: "/bgs/sept.gif"
    },
    {
      id: "id_27",
      channelNo: 27,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092750/oct_z3z4od.mp4",
      background: "/bgs/oct.gif"
    },
    {
      id: "id_28",
      channelNo: 28,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092792/nov_quyyts.mp4",
      background: "/bgs/nov.webp"
    },
    {
      id: "id_29",
      channelNo: 29,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767092733/dec_onhpwc.mp4",
      background: "/bgs/dec.gif"
    },
    {
      id: "id_30",
      channelNo: 30,
      isplayimg: false,
      category: "2025 Wrapped",
      videoUrl: "https://res.cloudinary.com/dgj8xqbxt/video/upload/v1767158218/Stranger_Things_5_Hindi_Finale_Trailer_Netflix_India_-_Netflix_India_720p_h264_ikg79f.mp4",
      background: "/bgs/st5.gif"
    },
  ]);

  const [tvChannels, setTvChannels] = useState(allTvChannels);
  const [currentCategories, setCurrentCategories] = useState(
    myCategories
      ? myCategories
      : ["Animal", "Entertainment", "Horror", "Nature", "Romance", "2025 Wrapped"]
  );
  const [moreCategories, setMoreCategories] = useState(
    more_Categories
      ? more_Categories
      : [
          "Merry Christmas",
          "Animae",
          "Science",
          "Kids",
          "Music",
          "News"
        ]
  );
  const [currentCategoryvalue, setCurrentCategoryValue] = useState(
    categoryValue ? categoryValue : "All"
  );
  const [currentChannel, setCurrentChannel] = useState(
    session_current_channel ? session_current_channel : tvChannels[0]
  );
  const [currentChannelId, setCurrentChannelId] = useState(
    session_current_channel ? session_current_channel?.id : "id_1"
  );
  const [isOn, setIsOn] = useState(tvState ? tvState : false);
  const [numInput, setNumInput] = useState(null);
  const [isCateOn, setIsCateOn] = useState(false);
  const [isCateEditable, setIsCateEditable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const numbtns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  // const [bugData,setBugData] = useState(null);
  useEffect(() =>{
   updateCategoryChannelList(currentCategoryvalue);
  },[currentCategoryvalue])

  useEffect(() => {
    // Initialize WebSocket connection
    const initializeWebSocket = async () => {
      try {
        await tvWebSocketService.connect();
        setIsConnected(true);
        
        // Set up command handlers
        tvWebSocketService.onCommand('POWER_TOGGLE', () => {
          setIsOn(prev => {
            const newState = !prev;
            tvWebSocketService.updateTvState({ isOn: newState });
            return newState;
          });
        });
        
        tvWebSocketService.onCommand('CHANNEL_SET', (payload) => {
          if (payload && payload.channelNo) {
            
            const channelNo = Number(payload.channelNo);
            const channel = tvChannels.find(ch => ch.channelNo === channelNo);
            console.log("channel", channel);
            if (channel) {
              setCurrentChannel(channel);
              setCurrentChannelId(channel.id);
              sessionStorage.setItem(
                "currentchannel",
                JSON.stringify(channel)
              );
            }
          }
        });
        
        tvWebSocketService.onCommand('CHANNEL_UP', (payload) => {
          console.log("payload in channel up", payload);
          // Filter channels based on the current category value
          const filteredChannels = getFilteredChannels(payload.channel.currentCategory);
          if (filteredChannels.length === 0) {
            return; // Exit if no channels match the filter
          }
          console.log("filtered channels", filteredChannels);
          
          // Find the current index in the appropriate array
          const currentIndex = filteredChannels.findIndex(
                (ch) => ch.id === payload.channel.currentChannelId
              )
          
          if (currentIndex === -1) {
            return; // Exit if the current channel is not found
          }
          const nextIndex = (currentIndex + 1) % filteredChannels.length; // Loop to the first channel if at the last one
          const nextChannel = filteredChannels[nextIndex];
          
          setCurrentChannelId(nextChannel.id);
          setCurrentChannel(nextChannel);
          sessionStorage.setItem(
            "currentchannel",
            JSON.stringify(nextChannel)
          );
          tvWebSocketService.updateTvState({ 
            currentChannel: nextChannel.channelNo,
            currentChannelId: nextChannel.id 
          });
        });
        // tvWebSocketService.onCommand('BUG_REPORT', (payload) => {
        //   console.log('Received bug report from remote:', payload);
        //   setBugData(payload);
        //   // Here you can implement any additional logic to handle the bug report
        // });
        tvWebSocketService.onCommand('CHANNEL_DOWN', (payload) => {
          // Filter channels based on the current category value
          const filteredChannels = getFilteredChannels(payload.channel.currentCategory);
          
          // This will be handled by the channel change function
          if (filteredChannels.length === 0) {
            return; // Exit if no channels match the filter
          }

          // Find the current index in the appropriate array
          const currentIndex = filteredChannels.findIndex(
            (ch) => ch.id === payload.channel.currentChannelId
          );
          if (currentIndex === -1) {
            return; // Exit if the current channel is not found
          }
          const prevIndex =
            (currentIndex - 1 + filteredChannels.length) %
            filteredChannels.length; // Loop to the last channel if at the first one
          const prevChannel = filteredChannels[prevIndex];
          setCurrentChannel(prevChannel);
          setCurrentChannelId(prevChannel.id);
          sessionStorage.setItem(
            "currentchannel",
            JSON.stringify(prevChannel)
          );

          tvWebSocketService.updateTvState({ 
            currentChannel: prevChannel.channelNo,
            currentChannelId: prevChannel.id 
          });
        });

        // Listen for remote validation events
        tvWebSocketService.onCommand('REMOTE_VALIDATED', (data) => {
          console.log('Remote device validated connection:', data);
          // Trigger event to close QR modal
          const event = new CustomEvent('remoteValidated', { detail: data });
          window.dispatchEvent(event);
        });
        
        tvWebSocketService.onCommand('CATEGORY_CHANGE', (payload) => {
          if (payload && payload.category) {
            setCurrentCategoryValue(payload.category);
            updateCategoryChannelList(payload.category);
            sessionStorage.setItem(
              "categoryValue",
              JSON.stringify(payload.category)
            );
            tvWebSocketService.updateTvState({ currentCategory: payload.category });
          }
        });

      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        setIsConnected(false);
      }
    };
    
    initializeWebSocket();
    
    // Cleanup on unmount
    return () => {
      tvWebSocketService.disconnect();
    };
  }, []);
  
  // Send TV state updates when relevant state changes
  useEffect(() => {
    if (isConnected) {
      tvWebSocketService.updateTvState({
        isOn,
        currentChannel: currentChannel?.channelNo,
        currentChannelId,
        currentCategory: currentCategoryvalue
      });
    }
  }, [isOn, currentChannel, currentChannelId, currentCategoryvalue, isConnected]);
  
  const getFilteredChannels = useCallback((category) => {
    const filteredChannels =
    category === "All"
      ? allTvChannels
      : allTvChannels.filter(
          (channel) => channel?.category === category
        );
    return filteredChannels;
  }, [allTvChannels]);

  const updateCategoryChannelList = (currentCategoryvalue) => {
    if (currentCategoryvalue !== "All") {
      const filteredTvChannels = allTvChannels.filter(
        (itm) => itm?.category === currentCategoryvalue
      );
      
      if (filteredTvChannels.length > 0) {
        setTvChannels(filteredTvChannels); // Update the state
      } else {
        console.warn(`No channels found for category: ${currentCategoryvalue}`);
        setTvChannels([]); // Reset to an empty array if no channels match
      }
    } else {
      setTvChannels(allTvChannels); // Show all channels for "All" category
    }
  };

  const contextValue = useMemo(() => ({
    allTvChannels,
    setAllTvChannels,
    tvChannels,
    setTvChannels,
    currentChannel,
    setCurrentChannel,
    currentCategories,
    setCurrentCategories,
    moreCategories,
    setMoreCategories,
    currentChannelId,
    setCurrentChannelId,
    isOn,
    setIsOn,
    numbtns,
    numInput,
    setNumInput,
    isCateOn,
    setIsCateOn,
    isCateEditable,
    setIsCateEditable,
    currentCategoryvalue,
    setCurrentCategoryValue,
    isConnected,
    // bugData
  }), [
    allTvChannels,
    tvChannels,
    currentChannel,
    currentCategories,
    moreCategories,
    currentChannelId,
    isOn,
    numInput,
    isCateOn,
    isCateEditable,
    currentCategoryvalue,
    isConnected,
    // bugData
  ]);

  return (
    <TvContext.Provider value={contextValue}>
      {children}
    </TvContext.Provider>
  );
};

TvProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom Hook
export const useTvCustomHook = () => {
  return useContext(TvContext);
};
