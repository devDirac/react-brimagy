import { useCallback, useRef } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ModalComponent from "components/Modal";
import {
    SharedPaginator,
    SharedTableEstadoVacio,
    SharedTableLoading,
} from "../../../shared/table";
import { useTextosReporteSemanal } from "../hooks/useTextosReporteSemanal";
import { useReporteSemanalAlmacen } from "../hooks/useReporteSemanalAlmacen";
import { usePaginacionProveedores } from "../hooks/usePaginacionProveedores";
import { useExcelReporteSemanal } from "../hooks/useExcelReporteSemanal";
import { OPCIONES_PAGINA_PROVEEDORES } from "../constants/reporteSemanalAlmacen.constants";
import { ReporteSemanalBusqueda } from "./ReporteSemanalBusqueda";
import { ReporteSemanalFiltros } from "./ReporteSemanalFiltros";
import { ReporteSemanalGrupo } from "./ReporteSemanalGrupo";
import { moneda } from "../utils/reporteSemanalAlmacenFormato.utils";

export const ReporteSemanalAlmacen = (): JSX.Element => {
    const textos = useTextosReporteSemanal();
    const datos = useReporteSemanalAlmacen(textos.sinProveedor);
    const paginacion = usePaginacionProveedores(datos.grupos);
    const excel = useExcelReporteSemanal(datos.idPeriodo, datos.semana, textos.excelError);
    const refLista = useRef<HTMLDivElement>(null);

    // Al cambiar de página se regresa al inicio de la lista de proveedores
    const { cambiarPagina } = paginacion;
    const irAPagina = useCallback(
        (indice: number) => {
            cambiarPagina(indice);
            refLista.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        [cambiarPagina]
    );

    return (
        <>
            <Box sx={{ mt: 3, width: "100%", position: "relative", minHeight: 240 }}>
                <SharedTableLoading visible={datos.cargando} />

                {/* Barra: buscador, periodo, semana y total*/}
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                    <ReporteSemanalBusqueda
                        valor={datos.busqueda}
                        onCambiar={datos.cambiarBusqueda}
                        placeholder={textos.buscar}
                    />
                    <ReporteSemanalFiltros
                        periodos={datos.periodos}
                        idPeriodo={datos.idPeriodo}
                        onCambiarPeriodo={datos.cambiarPeriodo}
                        reporte={datos.reporte}
                        semana={datos.semana}
                        onCambiarSemana={datos.cambiarSemana}
                        textoPeriodo={textos.periodo}
                        textoActivo={textos.activo}
                        textoSemana={textos.semana}
                        textoTodas={textos.todas}
                        textoExcel={textos.excel}
                        onDescargarExcel={excel.descargarExcel}
                        descargando={excel.descargando}
                        deshabilitado={datos.cargando}
                    />
                    {datos.grupos.length > 0 && (
                        <Typography sx={{ fontSize: 13, ml: "auto" }}>
                            {textos.totalVista}: <b>{moneda(datos.totales.total)}</b> · {datos.totales.registros}{" "}
                            {textos.registros}
                        </Typography>
                    )}
                </Box>

                <div ref={refLista} style={{ scrollMarginTop: 90 }}>
                    {datos.reporte && datos.grupos.length > 0
                        ? paginacion.visibles.map((grupo) => (
                            <ReporteSemanalGrupo
                                key={grupo.id}
                                grupo={grupo}
                                periodo={datos.reporte!.periodo}
                                textos={textos}
                            />
                        ))
                        : !datos.cargando && <SharedTableEstadoVacio mensaje={datos.error ?? textos.vacio} />}
                </div>

                {datos.grupos.length > 0 && (
                    <Box className="rounded-4 border">
                        <SharedPaginator
                            indicePagina={paginacion.indicePagina}
                            tamanoPagina={paginacion.tamanoPagina}
                            total={paginacion.total}
                            totalPaginas={paginacion.totalPaginas}
                            opcionesPorPagina={OPCIONES_PAGINA_PROVEEDORES}
                            deshabilitado={datos.cargando}
                            onCambiarPagina={irAPagina}
                            onCambiarTamanoPagina={paginacion.cambiarTamanoPagina}
                        />
                    </Box>
                )}
            </Box>
            <ModalComponent handleClose={excel.cerrarError} isOpen={excel.mensajeError !== null} key="alerta-excel">
                <Grid container spacing={2} style={{ textAlign: "center" }}>
                    <Grid item xs={12}>
                        <br />
                        <br />
                        <p>{excel.mensajeError}</p>
                    </Grid>
                </Grid>
            </ModalComponent>
        </>
    );
};