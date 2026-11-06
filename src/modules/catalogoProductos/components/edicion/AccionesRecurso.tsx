import { IconButton, Tooltip } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { RecursoProducto } from "../../types";

interface Props {
  item: RecursoProducto;
  /** "color", "talla", "monto", "foto"… se usa en los tooltips. */
  nombre: string;
  onEditar?: () => void;
  onActivar: () => void;
  onDesactivar: () => void;
}

/** Botones editar / activar / desactivar de un color, talla, monto o foto. */
const AccionesRecurso = ({ item, nombre, onEditar, onActivar, onDesactivar }: Props) => {
  const activo = item.status === "ACTIVE";

  return (
    <>
      {activo && onEditar && (
        <Tooltip title={`Editar ${nombre}`}>
          <IconButton aria-label="editar" size="small" color="warning" onClick={onEditar}>
            <EditNoteIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      )}
      {activo ? (
        <Tooltip title={`Desactivar ${nombre}`}>
          <IconButton aria-label="desactivar" size="small" color="error" onClick={onDesactivar}>
            <DisabledByDefaultIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={`Activar ${nombre}`}>
          <IconButton aria-label="activar" size="small" color="success" onClick={onActivar}>
            <CheckCircleOutlineIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default AccionesRecurso;
