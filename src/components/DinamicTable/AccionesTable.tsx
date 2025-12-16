import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React from "react";
import type { AccionesTableProps } from "./types";
import { useAccionesTable } from "./useAccionesTable";
import { useIntl } from "react-intl";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import "./style.scss";
import { useMaterialUIController } from "context";
import ReplayIcon from "@mui/icons-material/Replay";
import FaceRetouchingOffIcon from "@mui/icons-material/FaceRetouchingOff";
import DeleteIcon from "@mui/icons-material/Delete";

const AccionesTable: React.FC<AccionesTableProps> = (props: AccionesTableProps) => {
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const esModoDios = useSelector((state: any) => (state?.app?.user?.data?.tipo_usuario || 0) === 4);
  const { anchorEl, handleClick, handleClose } = useAccionesTable(props);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {props?.esListaUsuarios && props?.row?.status === "ACTIVE" ? (
        <Tooltip title={intl.formatMessage({ id: "general_desactivar_usuario" })}>
          <IconButton
            onClick={() => props?.enAccion("desactivar")}
            sx={{ color: darkMode ? "#fff" : "#d10d27" }}
          >
            <FaceRetouchingOffIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaUsuarios && props?.row?.status === "DEACTIVATE" ? (
        <Tooltip title={intl.formatMessage({ id: "general_reactivar_usuario" })}>
          <IconButton
            onClick={() => props?.enAccion("reactivar")}
            sx={{ color: darkMode ? "#fff" : "#1fff26", padding: "0" }}
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaCategorias ||
      props?.esListaProductos ||
      props?.esListaProveedores ||
      props?.esListaUsuarios ? (
        <Tooltip title={intl.formatMessage({ id: "general_editar" })}>
          <IconButton
            onClick={() =>
              props?.esListaProveedores
                ? props?.enAccion("editar_proveedor")
                : props?.esListaCategorias
                ? props?.enAccion("editar_categoria")
                : props?.enAccion("editar")
            }
            sx={{ color: darkMode ? "#fff" : "#f5a64c", padding: "0" }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaCategorias ||
      props?.esListaProductos ||
      props?.esListaProveedores ||
      props?.esListaUsuarios ? (
        <Tooltip title={intl.formatMessage({ id: "general_eliminar" })}>
          <IconButton
            onClick={() =>
              props?.esListaProveedores
                ? props?.enAccion("eliminar_proveedor")
                : props?.esListaCategorias
                ? props?.enAccion("eliminar_categoria")
                : props?.enAccion("eliminar")
            }
            sx={{ color: darkMode ? "#fff" : "#F54927", padding: "0" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </div>
  );
};

export default AccionesTable;
