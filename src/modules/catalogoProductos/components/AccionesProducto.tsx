import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import type { Producto } from "../types";

export interface HandlersProducto {
  onVer: (p: Producto) => void;
  onHistorial: (p: Producto) => void;
  onEditar: (p: Producto) => void;
  onEliminar: (p: Producto) => void;
  onCambiarDisponibilidad: (p: Producto) => void;
}

interface Props extends HandlersProducto {
  producto: Producto;
  /** Editar y eliminar (solo super admin). */
  puedeAdministrar: boolean;
  /** Marcar disponible / no disponible. */
  puedeCambiarDisponibilidad: boolean;
  direccion?: "row" | "column";
}

/** Botones de acción de un producto; los usan la tarjeta y la tabla. */
const AccionesProducto = ({
  producto: p,
  puedeAdministrar,
  puedeCambiarDisponibilidad,
  direccion = "row",
  onVer,
  onHistorial,
  onEditar,
  onEliminar,
  onCambiarDisponibilidad,
}: Props) => {
  const noDisponible = p.stock === 0;

  return (
    <Box sx={{ display: "flex", flexDirection: direccion, alignItems: "center", gap: direccion === "column" ? 1 : 0 }}>
      <Tooltip title="Vista Previa">
        <IconButton aria-label="ver" size="small" onClick={() => onVer(p)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Historial de cambios">
        <IconButton aria-label="historial" size="small" color="info" onClick={() => onHistorial(p)}>
          <HistoryIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {puedeAdministrar && (
        <>
          <Tooltip title="Editar producto">
            <IconButton aria-label="editar" size="small" color="warning" onClick={() => onEditar(p)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar producto">
            <IconButton aria-label="eliminar" size="small" color="error" onClick={() => onEliminar(p)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}

      {puedeCambiarDisponibilidad && (
        <Tooltip title={noDisponible ? "Marcar disponible" : "Marcar no disponible"}>
          <IconButton
            aria-label="disponibilidad"
            size="small"
            color={noDisponible ? "success" : "error"}
            onClick={() => onCambiarDisponibilidad(p)}
          >
            {noDisponible ? (
              <CheckBoxIcon fontSize="small" />
            ) : (
              <DisabledByDefaultIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default AccionesProducto;
