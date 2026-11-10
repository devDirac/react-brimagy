import { Box, Card, CardContent, IconButton, Tooltip, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import TagIcon from "@mui/icons-material/Tag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MDTypography from "components/MDTypography";
import { ProductosCanje } from "components/DetallesVistas/ProductosCanje";
import EstadoValidacionChip from "./EstadoValidacionChip";
import { formatearFecha, formatearPuntos } from "../utils";
import type { CanjeAgrupado } from "../types";

interface Props {
  canje: CanjeAgrupado;
  onVer: (canje: CanjeAgrupado) => void;
}

const CanjeCard = ({ canje, onVer }: Props) => {
  const tieneSinRegistrar = canje.productos?.some((p) => !p.id_producto);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition: "all 0.3s",
        "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
      }}
    >
      <EstadoValidacionChip estado={canje.estado_validacion} enEsquina />

      {/* Encabezado: folio, fecha y aviso */}
      <Box
        sx={{
          display: "flex",
          overflow: "hidden",
          bgcolor: "#a5eb2f",
          p: 1,
          borderBottom: "2px solid #02999e",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <TagIcon sx={{ color: "#eb2fa5", fontSize: 48 }} />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
            pl: "10px",
          }}
        >
          <MDTypography
            variant="caption"
            sx={{ overflow: "hidden", textOverflow: "ellipsis", fontWeight: 600, color: green[900] }}
          >
            {canje.folio}
          </MDTypography>
          <MDTypography variant="caption" sx={{ color: green[900], fontSize: "0.7rem" }}>
            {formatearFecha(canje.creacion_canje)}
          </MDTypography>
          {tieneSinRegistrar && (
            <MDTypography
              variant="caption"
              sx={{ color: "#b45309", fontSize: "0.7rem", fontWeight: 600 }}
            >
              ⚠ Tiene productos sin registrar
            </MDTypography>
          )}
        </Box>
      </Box>

      {/* Cuerpo: acciones a la izquierda, productos a la derecha */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            bgcolor: "grey.50",
            borderRight: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Tooltip title="Vista Previa">
            <IconButton aria-label="ver" size="small" onClick={() => onVer(canje)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <CardContent
          sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            {canje.productos.length} producto(s) · {formatearPuntos(canje.total_puntos)} pts
          </Typography>
          <ProductosCanje productos={canje.productos} porPagina={3} />
        </CardContent>
      </Box>
    </Card>
  );
};

export default CanjeCard;
