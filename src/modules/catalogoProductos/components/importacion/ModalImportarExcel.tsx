import { Box, Button, Grid, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ModalComponent from "components/Modal";
import TablaDatos from "components/TablaDatos";
import TextoCargando from "../TextoCargando";
import { columnasExcel, colorFilaExcel } from "../tabla/columnasExcel";
import { COLORES } from "../../constants";
import type { ImportacionExcel } from "../../hooks";
import type { ProductoExcel } from "../../types";

const AvisoFaltantes = ({ titulo, nombres }: { titulo: string; nombres: string[] }) =>
  nombres.length > 0 ? (
    <Grid item xs={12} md={4}>
      <Box sx={{ p: 2, bgcolor: "#fff3e0", borderRadius: 1, border: "2px solid #ff9800" }}>
        <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
          ⚠️ {titulo} ({nombres.length}):
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {nombres.join(", ")}
        </Typography>
      </Box>
    </Grid>
  ) : null;

const ModalImportarExcel = ({ excel }: { excel: ImportacionExcel }) => {
  const { productos, faltantes } = excel;
  const ocupado = excel.procesandoGuardado || excel.procesandoRegistro;

  const validos = productos.filter((p) => p.proveedor_valido && p.categoria_valida && !p.sku_vacio);
  const sinSku = productos.filter((p) => p.sku_vacio).length;
  const invalidos = productos.filter((p) => !p.proveedor_valido || !p.categoria_valida).length;
  const aGuardar = productos.filter(
    (p) => p.sku_vacio || (p.proveedor_valido && p.categoria_valida)
  ).length;

  return (
    <ModalComponent
      handleClose={excel.cerrar}
      isOpen={excel.modalAbierto}
      key="alertaSubirExcel"
      esFullScreen
    >
      <Grid container spacing={2}>
        <Grid item xs={12} mt={2} style={{ textAlign: "center" }}>
          <h5>Vista previa de productos del Excel</h5>
          <p>Total de productos: {productos.length}</p>
        </Grid>

        {productos.length > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ p: 2, bgcolor: "#e8f5e9", borderRadius: 1 }}>
                  <Typography variant="h6" color="success.main">
                    ✓ Productos válidos: {validos.length}
                    <br />✓ Sin SKU: {sinSku}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 2, bgcolor: "#ffebee", borderRadius: 1 }}>
                  <Typography variant="h6" color="error.main">
                    ✗ Productos inválidos: {invalidos}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}

        <AvisoFaltantes titulo="Proveedores no encontrados" nombres={faltantes.proveedores} />
        <AvisoFaltantes titulo="Categorías no encontradas" nombres={faltantes.categorias} />
        <AvisoFaltantes titulo="Plataformas no encontradas" nombres={faltantes.plataformas} />

        {excel.hayFaltantes && (
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<SaveIcon />}
              onClick={excel.registrarFaltantes}
              disabled={ocupado}
              sx={{ background: "#ff9800", color: "#fff", "&:hover": { background: "#f57c00" } }}
            >
              <TextoCargando
                cargando={excel.procesandoRegistro}
                textoCargando="Registrando proveedores y categorías"
                texto={`Registrar ${faltantes.proveedores.length} proveedor(es) | ${faltantes.categorias.length} Categoría(s) faltantes  | ${faltantes.plataformas.length} Plataforma(s) faltantes`}
              />
            </Button>
          </Grid>
        )}

        <Grid item xs={12} mt={2}>
          {productos.length > 0 ? (
            <TablaDatos<ProductoExcel>
              data={productos}
              columns={columnasExcel}
              getRowId={(p) => String(p.id)}
              conBuscador
              placeholderBuscador="Buscar en el Excel..."
              opcionesPorPagina={[25, 50, 100]}
              alturaMaxima={500}
              anchoMinimo={1700}
              colorFila={colorFilaExcel}
            />
          ) : (
            <p>No hay datos para mostrar</p>
          )}
        </Grid>

        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={excel.guardar}
            disabled={ocupado || productos.length === 0 || !excel.hayProductosValidos}
            sx={{ background: COLORES.primario, color: "#fff", mr: 2 }}
          >
            <TextoCargando
              cargando={excel.procesandoGuardado}
              textoCargando="Guardando productos"
              texto={`Guardar ${aGuardar} productos válidos`}
            />
          </Button>
          <Button
            variant="outlined"
            onClick={excel.cerrar}
            sx={{ color: COLORES.primario }}
            disabled={excel.procesandoGuardado}
          >
            Cancelar
          </Button>
        </Grid>

        {!excel.hayProductosValidos && productos.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 1, textAlign: "center" }}>
              <Typography variant="body1" color="info.main">
                ℹ️{" "}
                {excel.hayFaltantes
                  ? "Registra primero los proveedores, categorías o plataformas faltantes para habilitar el guardado de productos."
                  : "No hay productos válidos para guardar. Verifica los datos del Excel."}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </ModalComponent>
  );
};

export default ModalImportarExcel;
