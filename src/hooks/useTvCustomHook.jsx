import { useState, useEffect, useContext, createContext } from "react";

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
      category: "Romance",
      videoUrl: "https://dummyurl.com/video18",
    },
    {
      id: "id_19",
      channelNo: 19,
      isplayimg: false,
      category: "Romance",
      videoUrl: "https://dummyurl.com/video19",
    },
    {
      id: "id_20",
      channelNo: 20,
      isplayimg: false,
      category: "Romance",
      videoUrl: "https://dummyurl.com/video20",
    },
  ]);

  const [tvChannels, setTvChannels] = useState([
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
      category: "Romance",
      videoUrl: "https://dummyurl.com/video18",
    },
    {
      id: "id_19",
      channelNo: 19,
      isplayimg: false,
      category: "Romance",
      videoUrl: "https://dummyurl.com/video19",
    },
    {
      id: "id_20",
      channelNo: 20,
      isplayimg: false,
      category: "Romance",
      videoUrl: "https://dummyurl.com/video20",
    },
  ]);
  const [currentCategories, setCurrentCategories] = useState(
    myCategories
      ? myCategories
      : ["Animal", "Entertainment", "Horror", "Happy New Year"]
  );
  const [moreCategories, setMoreCategories] = useState(
    more_Categories
      ? more_Categories
      : [
          "Merry Christmas",
          "Romance",
          "Animae",
          "Nature",
          "Science",
          "Kids",
          "Music",
          "News",
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
  const numbtns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  useEffect(() => {
    // Your custom logic here
  }, []);

  return (
    <TvContext.Provider
      value={{
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
      }}
    >
      {children}
    </TvContext.Provider>
  );
};

// Custom Hook
export const useTvCustomHook = () => {
  return useContext(TvContext);
};
