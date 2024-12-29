import React, { useState } from 'react'
import useTvCustomHook from '../../../hooks/useTvCustomHook'
import { Button, DialogContent, IconButton, Tooltip, Typography } from '@mui/joy'
import EditIcon from '@mui/icons-material/Edit';
export default function ContainerStatic({ setIsCateEditable }) {
  const { currentCategories,currentCategoryvalue,setCurrentCategoryValue } = useTvCustomHook()

  const ChangeCategoryValue=(value)=>{
  setCurrentCategoryValue(value)
  sessionStorage.setItem("categoryValue",JSON.stringify(value))
  }
  
  return (
    <div className='relative'>
      <Typography
        component="h2"
        id="modal-title"
        level="h4"
        textColor="inherit"
        sx={{ fontWeight: 'lg', mb: 1,mt:-1 }}
      >
        Select category
      </Typography>
      <DialogContent>
        Select a category to explore content tailored to your interests.
      </DialogContent>
      {/* current categories  */}
      <div className=' flex gap-2 mt-2 flex-wrap w-[98%]'>
      <Button onClick={()=>ChangeCategoryValue("All")} variant={currentCategoryvalue=== "All"?"solid":"outlined"}>All</Button>
        {currentCategories?.map((itm, idx) => (
          <Button onClick={()=>ChangeCategoryValue(itm)} variant={currentCategoryvalue=== `${itm}`?"solid":"outlined"} key={idx}>{itm}</Button>
        ))}
      </div>
      <div
        onClick={() => setIsCateEditable(true)}
        className=' absolute bottom-0 right-0 -mr-4 -mb-4 '>
        <Tooltip title="Edit Categories">
          <IconButton variant="soft" color="danger">
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
