import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Container from "./categorymodalInner/editable/Container";
import ContainerStatic from "./categorymodalInner/noteditable/ContainerStatic";
import { useTvCustomHook } from "../hooks/useTvCustomHook";

export default function ChannelCategory() {
  const { isCateEditable, isCateOn, setIsCateOn } = useTvCustomHook();
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={isCateOn}
        onClose={() => setIsCateOn(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
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
          {isCateEditable ? <Container /> : <ContainerStatic />}
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
