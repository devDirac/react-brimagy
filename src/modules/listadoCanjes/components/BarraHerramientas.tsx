import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useIntl } from "react-intl";
import type { Visualizacion } from "../types";

interface Props {
  visualizacion: Visualizacion;
  onCambiarVisualizacion: (e: React.MouseEvent<HTMLElement>, v: Visualizacion | null) => void;
  onAbrirFechas: () => void;
  buscador: string;
  onBuscadorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BarraHerramientas = ({
  visualizacion,
  onCambiarVisualizacion,
  onAbrirFechas,
  buscador,
  onBuscadorChange,
}: Props) => {
  const intl = useIntl();

  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={8}>
        <ToggleButtonGroup
          value={visualizacion}
          exclusive
          onChange={onCambiarVisualizacion}
          aria-label="Visualización de canjes"
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
                "&:hover": { background: "#a5eb2f", color: "#2f2f2f" },
              }}
            >
              <DateRangeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      </Grid>
    </Grid>
  );
};

export default BarraHerramientas;
