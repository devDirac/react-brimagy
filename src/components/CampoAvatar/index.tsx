import React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import useCampoAvatar from "./useCampoAvatar";
import ModalComponent from "../Modal";
import { Grid } from "@mui/material";
import "./style.scss";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    color: "#44b700",
    fontSize: "19px",
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export interface CampoAvatarProps {
  alt: string;
  onChangeImage?: (data: any) => void;
  foto: string;
}

const CampoAvatar: React.FC<CampoAvatarProps> = (props: CampoAvatarProps) => {
  const {
    handleEditPictureProfile,
    enviaImagen,
    reference,
    isAlertOpen,
    handleisAlerClose,
    mensajeAlert,
  } = useCampoAvatar(props);

  return (
    <Stack direction="row" spacing={2}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <EditIcon
            fontSize="large"
            style={{ cursor: "pointer" }}
            onClick={handleEditPictureProfile}
          />
        }
      >
        <Avatar alt={props?.alt || ""} src={props?.foto} sx={{ width: 100, height: 100 }} />
      </StyledBadge>
      <input
        onChange={(e) => {
          enviaImagen(e);
        }}
        onClick={(event: any) => {
          event.target.value = null;
        }}
        ref={reference}
        type="file"
        id="file-selector"
        accept=".jpg, .jpeg, .png"
        style={{ visibility: "hidden" }}
      />
      <ModalComponent handleClose={handleisAlerClose} isOpen={isAlertOpen} key={"alerta"}>
        <Grid container spacing={2} style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <br />
            <br />
            <p>{mensajeAlert}</p>
          </Grid>
        </Grid>
      </ModalComponent>
    </Stack>
  );
};

export default CampoAvatar;
