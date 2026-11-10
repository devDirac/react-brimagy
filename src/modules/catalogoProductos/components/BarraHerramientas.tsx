import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useIntl } from "react-intl";
import { COLORES } from "../constants";
import type { Visualizacion } from "../types";

interface Props {
  hayProductos: boolean;
  onSubirExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescargarExcel: () => void;
  onAbrirBusquedaInteligente: () => void;
  visualizacion: Visualizacion;
  onCambiarVisualizacion: (e: React.MouseEvent<HTMLElement>, v: Visualizacion | null) => void;
  onAbrirFechas: () => void;
  buscador: string;
  onBuscadorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BarraHerramientas = ({
  hayProductos,
  onSubirExcel,
  onDescargarExcel,
  onAbrirBusquedaInteligente,
  visualizacion,
  onCambiarVisualizacion,
  onAbrirFechas,
  buscador,
  onBuscadorChange,
}: Props) => {
  const intl = useIntl();

  return (
    <Grid container spacing={2} mb={2}>
      <Grid
        item
        xs={9}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
          sx={{ background: COLORES.primario, color: "#fff" }}
        >
          Subir Excel
          <input type="file" hidden accept=".xlsx, .xls" onChange={onSubirExcel} />
        </Button>

        <Button
          variant="outlined"
          startIcon={<SimCardDownloadIcon />}
          onClick={onDescargarExcel}
          sx={{ borderColor: COLORES.primario, color: COLORES.primario }}
        >
          {intl.formatMessage({ id: hayProductos ? "descargar_productos" : "descargar_plantilla" })}
        </Button>

        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          endIcon={<AutoAwesomeIcon />}
          onClick={onAbrirBusquedaInteligente}
          sx={{
            background: COLORES.verde,
            color: COLORES.oscuro,
            "&:hover": { background: COLORES.oscuro, color: "#fff" },
            "&:focus:not(:hover)": { background: COLORES.verde },
          }}
        >
          Búsqueda Intelimagy
        </Button>

        <ToggleButtonGroup
          value={visualizacion}
          exclusive
          onChange={onCambiarVisualizacion}
          aria-label="Visualización de productos"
          sx={{ margin: "0 10px" }}
        >
          <Tooltip title="Cuadricula">
            <ToggleButton value="cuadricula" aria-label="cuadricula">
              <ViewModuleIcon />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Tabla">
            <ToggleButton value="tabla" aria-label="tabla">
              <TableRowsIcon />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Buscar por fecha">
            <IconButton
              aria-label="buscar por fecha"
              size="small"
              onClick={onAbrirFechas}
              sx={{
                border: "1px solid #0000001f",
                borderRadius: 0,
                "&:hover": { background: COLORES.verde, color: COLORES.oscuro },
              }}
            >
              <DateRangeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Grid>

      <Grid
        item
        xs={12}
        sm={3}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {visualizacion === "cuadricula" && (
          <TextField
            id="buscador"
            fullWidth
            label={intl.formatMessage({ id: "input_buscador" })}
            variant="standard"
            name="buscador"
            value={buscador}
            onChange={onBuscadorChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="medium" />
                </InputAdornment>
              ),
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default BarraHerramientas;
