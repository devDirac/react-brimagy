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
import VisibilityIcon from "@mui/icons-material/Visibility";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { StoreType } from "types/genericTypes";
import HistoryIcon from "@mui/icons-material/History";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

const AccionesTable: React.FC<AccionesTableProps> = (props: AccionesTableProps) => {
  const intl = useIntl();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const esModoDios = useSelector((state: any) => (state?.app?.user?.data?.tipo_usuario || 0) === 4);
  const { anchorEl, handleClick, handleClose } = useAccionesTable(props);

  const tipoUsuario = useSelector((state: StoreType) => state?.app?.user?.data?.tipo_usuario || 0);
  const esSuperAdmin = tipoUsuario === 7;

  const listasConEliminar =
    [props?.esListaCategorias, props?.esListaProductos, props?.esListaProveedores].some(Boolean) &&
    !props?.esListaUsuariosPlataforma &&
    !props?.esListaUsuarios &&
    !props?.esListaCategorias &&
    esSuperAdmin;

  const listasConEditar =
    [
      props?.esListaCategorias,
      props?.esListaProductos,
      props?.esListaProveedores,
      props?.esListaUsuariosPlataforma,
      props?.esListaUsuarios,
    ].some(Boolean) && esSuperAdmin;

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

      {(props?.esListaUsuarios && props?.row?.status === "INACTIVE") ||
      props?.row?.status === "DEACTIVATE" ? (
        <Tooltip title={intl.formatMessage({ id: "general_reactivar_usuario" })}>
          <IconButton
            onClick={() => props?.enAccion("reactivar")}
            sx={{ color: darkMode ? "#fff" : "#1fff26", padding: "0" }}
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaProductos || props?.esListaCanjes ? (
        <Tooltip title={intl.formatMessage({ id: "vista_previa" })}>
          <IconButton
            onClick={() => props?.enAccion("vista_previa")}
            sx={{ color: darkMode ? "#fff" : "#1fff26", padding: "0" }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaProductos ? (
        <Tooltip title={intl.formatMessage({ id: "historial_de_cambios" })}>
          <IconButton
            onClick={() => props?.enAccion("historial_cambios")}
            sx={{ color: darkMode ? "#fff" : "#189db5", padding: "0" }}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaProductos && props?.row?.stock === 0 ? (
        <Tooltip title={intl.formatMessage({ id: "marcar_disponible" })}>
          <IconButton
            onClick={() => props?.enAccion("marcar_disponible")}
            sx={{ color: darkMode ? "#fff" : "#127327", padding: "0" }}
          >
            <CheckBoxIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaProductos && props?.row?.stock !== 0 ? (
        <Tooltip title={intl.formatMessage({ id: "marcar_no_disponible" })}>
          <IconButton
            onClick={() => props?.enAccion("marcar_no_disponible")}
            sx={{ color: darkMode ? "#fff" : "#ad1c2a", padding: "0" }}
          >
            <DisabledByDefaultIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaOrdenesCompra ? (
        <Tooltip title={intl.formatMessage({ id: "crear_orden_compra" })}>
          <IconButton
            onClick={() => props?.enAccion("crear_orden_compra")}
            sx={{ color: darkMode ? "#fff" : "#216600", padding: "0" }}
          >
            <LibraryAddIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaOrdenesCompra ? (
        <Tooltip title={intl.formatMessage({ id: "ver_orden_compra" })}>
          <IconButton
            onClick={() => props?.enAccion("vista_previa")}
            sx={{ color: darkMode ? "#fff" : "#0090a0", padding: "0" }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {listasConEditar ? (
        <Tooltip title={intl.formatMessage({ id: "general_editar" })}>
          <IconButton
            onClick={() =>
              props?.esListaProveedores
                ? props?.enAccion("editar_proveedor")
                : props?.esListaCategorias
                ? props?.enAccion("editar_categoria")
                : props?.esListaUsuarios
                ? props?.enAccion("editar_usuario")
                : props?.enAccion("editar")
            }
            sx={{ color: darkMode ? "#fff" : "#f5a64c", padding: "0" }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {listasConEliminar ? (
        <Tooltip title={intl.formatMessage({ id: "general_eliminar" })}>
          <IconButton
            onClick={() =>
              props?.esListaProveedores
                ? props?.enAccion("eliminar_proveedor")
                : props?.enAccion("eliminar")
            }
            sx={{ color: darkMode ? "#fff" : "#F54927", padding: "0" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaCategorias && props?.row?.status !== "INACTIVE" ? (
        <Tooltip title={intl.formatMessage({ id: "general_eliminar" })}>
          <IconButton
            onClick={() => props?.enAccion("eliminar_categoria")}
            sx={{ color: darkMode ? "#fff" : "#F54927", padding: "0" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaCategorias && props?.row?.status === "INACTIVE" ? (
        <Tooltip title={intl.formatMessage({ id: "general_reactivar" })}>
          <IconButton
            onClick={() => props?.enAccion("reactivar_categoria")}
            sx={{ color: darkMode ? "#fff" : "#1fff26", padding: "0" }}
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {props?.esListaRespuestas ? (
        <Tooltip title={intl.formatMessage({ id: "general_ver_respuesta" })}>
          <IconButton
            onClick={() => props?.enAccion("ver_respuesta")}
            sx={{ color: darkMode ? "#fff" : "#76a5af", padding: "0" }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </div>
  );
};

export default AccionesTable;
