import TablePagination from "@mui/material/TablePagination";
import MDBox from "components/MDBox";
import { OPCIONES_POR_PAGINA } from "../constants";

interface Props {
  total: number;
  pagina: number;
  porPagina: number;
  onCambiarPagina: (pagina: number) => void;
  onCambiarPorPagina: (porPagina: number) => void;
}

const PaginacionProductos = ({
  total,
  pagina,
  porPagina,
  onCambiarPagina,
  onCambiarPorPagina,
}: Props) => (
  <MDBox mt={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <TablePagination
      component="div"
      count={total}
      page={pagina}
      onPageChange={(_, nueva) => onCambiarPagina(nueva)}
      rowsPerPage={porPagina}
      onRowsPerPageChange={(e) => onCambiarPorPagina(parseInt(e.target.value, 10))}
      rowsPerPageOptions={OPCIONES_POR_PAGINA}
      labelRowsPerPage="Productos por página:"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      sx={{
        direction: "ltr",
        ".MuiTablePagination-toolbar": { justifyContent: "space-between", padding: "16px 24px" },
        ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": { margin: 0 },
        ".MuiTablePagination-actions svg": { transform: "scaleX(-1)" },
      }}
    />
  </MDBox>
);

export default PaginacionProductos;
