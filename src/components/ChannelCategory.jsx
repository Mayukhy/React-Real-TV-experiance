import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import useTvCustomHook from '../hooks/useTvCustomHook';
import Container from './categorymodalInner/editable/Container';
import ContainerStatic from './categorymodalInner/noteditable/ContainerStatic';

export default function ChannelCategory({isCateOn,setIsCateOn}) {
 const {isCateEditable,setIsCateEditable} = useTvCustomHook()
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={isCateOn}
        onClose={() => setIsCateOn(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            minWidth: { md: 550, xs: "100%" },
            maxWidth: 550,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
          
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
           {isCateEditable?<Container setIsCateEditable={setIsCateEditable}/>:<ContainerStatic setIsCateEditable={setIsCateEditable}/>}
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}