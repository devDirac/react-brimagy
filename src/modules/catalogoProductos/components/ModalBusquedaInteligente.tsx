import { Button, Grid, InputAdornment, MenuItem, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useIntl } from "react-intl";
import ModalComponent from "components/Modal";
import TextoCargando from "./TextoCargando";
import { COLORES } from "../constants";
import type { CatalogoProductosState } from "../hooks";

interface Props {
  bi: CatalogoProductosState["busquedaInteligente"];
  categorias: any[];
}

const ModalBusquedaInteligente = ({ bi, categorias }: Props) => {
  const intl = useIntl();
  const sinCategorias = !categorias || categorias.length === 0;

  return (
    <ModalComponent handleClose={bi.cerrar} isOpen={bi.modalAbierto} key="alertaBI">
      <Grid container spacing={2} style={{ textAlign: "center" }}>
        <Grid item xs={12} m={2}>
          <Typography variant="button" gutterBottom sx={{ fontSize: "18px", fontWeight: 600 }}>
            Búsqueda inteli<b style={{ color: COLORES.verde }}>magy</b>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id="buscarPorPuntos"
            fullWidth
            label={intl.formatMessage({ id: "input_buscar_por_puntos" })}
            variant="standard"
            value={bi.puntos}
            onChange={(e) => bi.setPuntos(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="medium" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id="categoriaBuscar"
            select
            fullWidth
            label={`${intl.formatMessage({ id: "select_categoria_producto" })} *`}
            variant="standard"
            value={bi.categoria}
            disabled={sinCategorias}
            helperText={sinCategorias ? intl.formatMessage({ id: "sin_categorias_registradas" }) : ""}
            onChange={(e) => bi.setCategoria(e.target.value)}
            InputProps={{ style: { padding: "5px" } }}
          >
            <MenuItem value="">{intl.formatMessage({ id: "seleccionar_categoria" })}</MenuItem>
            {categorias?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.desc}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} display="flex" justifyContent="center">
          <Button
            variant="contained"
            endIcon={<AutoFixHighIcon />}
            disabled={bi.procesando}
            onClick={bi.buscar}
            sx={{
              background: COLORES.verde,
              color: COLORES.oscuro,
              ml: 2,
              "&:hover": { background: COLORES.oscuro, color: "#fff" },
              "&:focus:not(:hover)": { background: COLORES.verde },
            }}
          >
            <TextoCargando
              cargando={bi.procesando}
              texto={intl.formatMessage({ id: "realizar_busqueda_magica" })}
              textoCargando={intl.formatMessage({ id: "realizando_busqueda" })}
            />
          </Button>
        </Grid>
      </Grid>
    </ModalComponent>
  );
};

export default ModalBusquedaInteligente;
