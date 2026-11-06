import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import HardwareIcon from "@mui/icons-material/Hardware";
import ComputerIcon from "@mui/icons-material/Computer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import MDTypography from "components/MDTypography";
import { COLORES } from "../constants";
import { formatearNumero, truncarTexto } from "../utils";
import AccionesProducto, { HandlersProducto } from "./AccionesProducto";
import type { Producto } from "../types";

interface Props extends HandlersProducto {
  producto: Producto;
  esSuperAdmin: boolean;
}

const ChipTipo = ({ producto }: { producto: Producto }) => {
  const noDisponible = producto.stock === 0;
  const icono = noDisponible ? (
    <DisabledByDefaultIcon />
  ) : producto.tipo_producto === "fisico" ? (
    <HardwareIcon />
  ) : (
    <ComputerIcon />
  );

  return (
    <Chip
      icon={icono}
      label={noDisponible ? "NO DISPONIBLE" : producto.tipo_producto?.toUpperCase()}
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        p: 1,
        fontWeight: 500,
        borderRadius: "0 0 0 20px",
        background: COLORES.rosa,
        maxWidth: "150px",
        height: "auto",
        whiteSpace: "normal",
        "& .MuiChip-label": {
          whiteSpace: "normal",
          display: "block",
          lineHeight: "12px",
          color: "#FFF9C4 !important",
        },
        "& .MuiChip-icon": {
          color: "#FFF9C4 !important",
          fontSize: "20px !important",
          width: "20px !important",
          height: "20px !important",
          marginTop: "2px",
          alignSelf: "flex-start",
        },
      }}
    />
  );
};

const Dato = ({ etiqueta, valor }: { etiqueta: string; valor?: string }) => (
  <MDTypography variant="caption" display="block" color="text" noWrap>
    <strong>{etiqueta}:</strong> {valor ?? "N/A"}
  </MDTypography>
);

const ProductoCard = ({ producto: p, esSuperAdmin, ...handlers }: Props) => {
  const noDisponible = p.stock === 0;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition: "all 0.3s",
        ...(noDisponible ? { border: "2px solid red" } : {}),
        "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
      }}
    >
      <ChipTipo producto={p} />

      {/* Encabezado: marca */}
      <Box
        sx={{
          display: "flex",
          overflow: "hidden",
          bgcolor: COLORES.verde,
          p: 1,
          borderBottom: `2px solid ${COLORES.rosa}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <InventoryIcon sx={{ color: COLORES.rosa, fontSize: 48 }} />
        </Box>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
          <MDTypography
            variant="button"
            sx={{
              fontSize: "14px",
              pl: "5px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: 600,
              color: "#121f09",
            }}
          >
            {p.marca}
          </MDTypography>
        </Box>
      </Box>

      {/* Cuerpo: acciones a la izquierda, datos a la derecha */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Box
          sx={{
            p: 1.5,
            bgcolor: "grey.50",
            borderRight: "1px solid",
            borderColor: "grey.200",
          }}
        >
          {/* En la tarjeta, todas las acciones de administración son solo para super admin */}
          <AccionesProducto
            producto={p}
            direccion="column"
            puedeAdministrar={esSuperAdmin}
            puedeCambiarDisponibilidad={esSuperAdmin}
            {...handlers}
          />
        </Box>

        <CardContent sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Typography variant="button" gutterBottom noWrap sx={{ fontWeight: 600 }}>
            {p.nombre_producto}
          </Typography>
          <Typography variant="caption" gutterBottom sx={{ display: "block", mb: 1.5 }}>
            {truncarTexto(p.descripcion, 60)}
          </Typography>
          <Box sx={{ mt: "auto" }}>
            <Dato etiqueta="Sku" valor={p.sku} />
            <Dato etiqueta="Color" valor={p.color} />
            <Dato etiqueta="Categoría" valor={p.catalogo} />
            <Dato etiqueta="Proveedor" valor={p.proveedor} />
          </Box>
        </CardContent>
      </Box>

      {/* Pie: plataforma y factor */}
      <Box sx={{ display: "flex", alignItems: "center", bgcolor: COLORES.verde }}>
        <Box sx={{ width: "100%", textAlign: "center", overflow: "hidden" }}>
          <Typography variant="button" gutterBottom noWrap sx={{ fontWeight: 600 }}>
            {p.nombre_plataforma}
          </Typography>
        </Box>
        <Box sx={{ width: "100%", textAlign: "center", overflow: "hidden" }}>
          <EmojiEventsIcon />{" "}
          <Typography variant="button" gutterBottom noWrap sx={{ fontWeight: 600 }}>
            {formatearNumero(p.factor, 2, "", false)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ProductoCard;
