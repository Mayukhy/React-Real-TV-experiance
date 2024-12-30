import React, { useEffect, useRef } from "react";
import {
  Button,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useTvCustomHook } from "../../../hooks/useTvCustomHook";
export default function ContainerStatic() {
  const {
    setIsCateEditable,
    setTvChannels,
    allTvChannels,
    currentCategories,
    currentCategoryvalue,
    setCurrentCategoryValue,
  } = useTvCustomHook();
  const navigate = useNavigate();
  const isInitialRender = useRef(true);
  const ChangeCategoryValue = (value) => {
    setCurrentCategoryValue(value);
    // sessionStorage.setItem("categoryValue",JSON.stringify(value))
  };

  useEffect(() => {
    // Skip the first render to prevent unnecessary state updates
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (currentCategoryvalue !== "All") {
      const filteredTvChannels = allTvChannels.filter(
        (itm) => itm?.category === currentCategoryvalue
      );

      if (filteredTvChannels.length > 0) {
        setTvChannels(filteredTvChannels); // Update the state
        setTimeout(() => {
          navigate(`/channel/${filteredTvChannels[0]?.channelNo}`);
        }, 1000);
      } else {
        console.warn(`No channels found for category: ${currentCategoryvalue}`);
        setTvChannels([]); // Reset to an empty array if no channels match
      }
    } else {
      setTvChannels(allTvChannels); // Show all channels for "All" category
    }
  }, [currentCategoryvalue]);

  return (
    <div className="relative">
      <Typography
        component="h2"
        id="modal-title"
        level="h4"
        textColor="inherit"
        sx={{ fontWeight: "lg", mb: 1, mt: -1 }}
      >
        Select category
      </Typography>
      <DialogContent>
        Select a category to explore content tailored to your interests.
      </DialogContent>
      {/* current categories  */}
      <div className=" flex gap-2 mt-2 flex-wrap w-[98%]">
        <Button
          onClick={() => ChangeCategoryValue("All")}
          variant={currentCategoryvalue === "All" ? "solid" : "outlined"}
        >
          All
        </Button>
        {currentCategories?.map((itm, idx) => (
          <Button
            onClick={() => ChangeCategoryValue(itm)}
            variant={currentCategoryvalue === `${itm}` ? "solid" : "outlined"}
            key={idx}
          >
            {itm}
          </Button>
        ))}
      </div>
      <div
        onClick={() => setIsCateEditable(true)}
        className=" absolute bottom-0 right-0 -mr-4 -mb-4 "
      >
        <Tooltip title="Edit Categories">
          <IconButton variant="soft" color="danger">
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
