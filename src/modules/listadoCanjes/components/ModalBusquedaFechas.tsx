import { Button, Grid, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  fecha1: string;
  setFecha1: (v: string) => void;
  fecha2: string;
  setFecha2: (v: string) => void;
  onBuscar: () => void;
  deshabilitado?: boolean;
}

const ModalBusquedaFechas = ({
  abierto,
  onCerrar,
  fecha1,
  setFecha1,
  fecha2,
  setFecha2,
  onBuscar,
  deshabilitado,
}: Props) => {
  const intl = useIntl();

  const selector = (valor: string, setValor: (v: string) => void) => (
    <DatePicker
      label={intl.formatMessage({ id: "input_fecha" })}
      openTo="year"
      format="YYYY/MM/DD"
      views={["year", "month", "day"]}
      value={valor ? dayjs(valor) : null}
      onChange={(nuevo) => setValor(nuevo ? dayjs(nuevo).format("YYYY-MM-DD") : "")}
      slotProps={{ textField: { error: false, variant: "standard" } }}
      sx={{ width: "100%" }}
    />
  );

  return (
    <ModalComponent handleClose={onCerrar} isOpen={abierto} key="alertaFechas">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <Grid container spacing={2} mt={4} mb={2} sx={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom noWrap sx={{ fontWeight: 600 }}>
              BUSCAR CANJES POR FECHA
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {selector(fecha1, setFecha1)}
          </Grid>
          <Grid item xs={4}>
            {selector(fecha2, setFecha2)}
          </Grid>
          <Grid item xs={4}>
            <Button
              sx={{ color: "#fff", background: "#084d6e" }}
              variant="contained"
              endIcon={<SearchIcon />}
              disabled={deshabilitado}
              onClick={onBuscar}
            >
              {intl.formatMessage({ id: "buscar_por_fecha" })}
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </ModalComponent>
  );
};

export default ModalBusquedaFechas;
