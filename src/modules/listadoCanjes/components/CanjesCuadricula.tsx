import Grid from "@mui/material/Grid";
import CanjeCard from "./CanjeCard";
import PaginacionCanjes from "./PaginacionCanjes";
import { usePaginacion } from "../hooks";
import type { CanjeAgrupado } from "../types";

interface Props {
  canjes: CanjeAgrupado[];
  onVer: (canje: CanjeAgrupado) => void;
}

const CanjesCuadricula = ({ canjes, onVer }: Props) => {
  const { pagina, porPagina, paginados, setPagina, cambiarPorPagina } = usePaginacion(canjes);

  return (
    <>
      <Grid container spacing={2}>
        {paginados.map((canje) => (
          <Grid item xs={12} sm={6} md={4} key={canje.id}>
            <CanjeCard canje={canje} onVer={onVer} />
          </Grid>
        ))}
      </Grid>

      <PaginacionCanjes
        total={canjes.length}
        pagina={pagina}
        porPagina={porPagina}
        onCambiarPagina={setPagina}
        onCambiarPorPagina={cambiarPorPagina}
      />
    </>
  );
};

export default CanjesCuadricula;
