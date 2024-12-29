import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useTvCustomHook from "../../../hooks/useTvCustomHook";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { IconButton, Tooltip, Typography } from "@mui/joy";

export default function Container({ setIsCateEditable }) {
  const { currentCategories, setCurrentCategories, moreCategories, setMoreCategories, currentCategoryvalue } = useTvCustomHook();
  const [message, setMessage] = useState(""); // To display feedback messages

  const handleChangeCategories = () => {
    sessionStorage.setItem("mycategories", JSON.stringify(currentCategories));
    sessionStorage.setItem("morecategories", JSON.stringify(moreCategories));
    setIsCateEditable(false);
  };

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    // Prevent dragging `currentCategoryvalue` to another list
    if (
      source.droppableId === "currentCategories" &&
      destination.droppableId === "moreCategories" &&
      currentCategories[source.index] === currentCategoryvalue
    ) {
      setMessage("This category cannot be moved to More Categories.");
      return;
    }

    // Handle reordering within the same list
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "currentCategories") {
        const list = [...currentCategories];
        const [movedItem] = list.splice(source.index, 1);
        list.splice(destination.index, 0, movedItem);
        setCurrentCategories(list);
      } else {
        const list = [...moreCategories];
        const [movedItem] = list.splice(source.index, 1);
        list.splice(destination.index, 0, movedItem);
        setMoreCategories(list);
      }
      setMessage(""); // Clear any error message
      return;
    }

    // Prevent adding more than 5 items to currentCategories
    if (
      destination.droppableId === "currentCategories" &&
      currentCategories.length >= 5
    ) {
      setMessage("Current Categories cannot have more than 5 items.");
      return;
    }

    // Handle moving between lists
    const sourceList =
      source.droppableId === "currentCategories"
        ? [...currentCategories]
        : [...moreCategories];
    const destinationList =
      destination.droppableId === "currentCategories"
        ? [...currentCategories]
        : [...moreCategories];

    const [movedItem] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedItem);

    if (source.droppableId === "currentCategories") {
      setCurrentCategories(sourceList);
    } else {
      setMoreCategories(sourceList);
    }

    if (destination.droppableId === "currentCategories") {
      setCurrentCategories(destinationList);
    } else {
      setMoreCategories(destinationList);
    }

    setMessage("");
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="relative">
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          sx={{ fontWeight: 'lg', mb: 1, mt: -1 }}
        >
          Edit Categories
        </Typography>
        <div
          onClick={handleChangeCategories}
          className="absolute bottom-0 right-0 -mr-4 -mb-4"
        >
          <Tooltip title="Save Categories">
            <IconButton variant="soft" color="success">
              <DoneOutlineIcon />
            </IconButton>
          </Tooltip>
        </div>
        {message && <div className="text-red-500 mb-3">{message}</div>}

        {/* Current Categories */}
        <Droppable droppableId="currentCategories" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-2 flex-wrap w-[98%]"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {currentCategories.map((item, index) => (
                <Draggable
                  key={item}
                  draggableId={item}
                  index={index}
                  isDragDisabled={item === currentCategoryvalue} // Disable drag for `currentCategoryvalue`
                >
                  {(provided) => (
                    <div
                      className={`border p-2 ${
                        item === currentCategoryvalue
                          ? "border-gray-400 opacity-50 cursor-not-allowed"
                          : "border-indigo-400"
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(item !== currentCategoryvalue && provided.dragHandleProps)} // Disable drag handle for `currentCategoryvalue`
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="w-full h-[1px] bg-zinc-700 my-5"></div>

        {/* More Categories */}
        <Droppable droppableId="moreCategories" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-2 flex-wrap w-[98%]"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {moreCategories.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <div
                      className="border border-rose-400 p-2"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
