import Grid from "@mui/material/Grid";
import ProductoCard from "./ProductoCard";
import type { HandlersProducto } from "./AccionesProducto";
import PaginacionProductos from "./PaginacionProductos";
import { usePaginacion } from "../hooks";
import type { Producto } from "../types";

interface Props extends HandlersProducto {
  productos: Producto[];
  esSuperAdmin: boolean;
}

const ProductosCuadricula = ({ productos, esSuperAdmin, ...acciones }: Props) => {
  const { pagina, porPagina, paginados, setPagina, cambiarPorPagina } = usePaginacion(productos);

  return (
    <>
      <Grid container spacing={2}>
        {paginados.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <ProductoCard producto={p} esSuperAdmin={esSuperAdmin} {...acciones} />
          </Grid>
        ))}
      </Grid>
      <PaginacionProductos
        total={productos.length}
        pagina={pagina}
        porPagina={porPagina}
        onCambiarPagina={setPagina}
        onCambiarPorPagina={cambiarPorPagina}
      />
    </>
  );
};

export default ProductosCuadricula;
