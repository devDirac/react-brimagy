import React from "react";
import "./style.scss";
import type { ModalProps } from "./types";
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import _ from "lodash";
import { useMaterialUIController } from "context";
import { TransitionProps } from "@mui/material/transitions";
import InfoIcon from "@mui/icons-material/Info";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalComponent: React.FC<ModalProps> = (props: ModalProps) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  return (
    <>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={props?.esFullScreen}
        open={props?.isOpen || false}
        onClose={props?.handleClose}
        maxWidth={props?.size || "md"}
        fullWidth={_.isEmpty(props?.size)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: darkMode ? "#3b435f" : "white",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            ...{ color: "#ffff", backgroundColor: "#344767" },
            ...(props?.esError ? { borderBottom: "solid 4px red" } : {}),
          }}
        >
          <InfoIcon fontSize="large" style={{ color: "#ffff" }} />
        </DialogTitle>
        {props?.title ? (
          <DialogTitle id="alert-dialog-title" sx={{ color: darkMode ? "white" : "#344767" }}>
            {props?.title}
          </DialogTitle>
        ) : null}
        <DialogContent style={{ color: darkMode ? "white" : "black" }}>
          {props?.children}
        </DialogContent>
        <DialogActions
          style={{
            ...{ color: "#344767" /* , backgroundColor:'#344767' */ },
            ...(props?.esError ? { borderTop: "solid 4px red" } : {}),
          }}
        >
          <Button onClick={props?.handleClose} autoFocus style={{ color: "#344767" }}>
            {props?.titleBoton ? props?.titleBoton : "Minimizar"}
          </Button>
        </DialogActions>
        <Backdrop style={{ zIndex: 1000, color: "#fff" }} open={props?.procesando || false}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog>
    </>
  );
};

export default ModalComponent;
