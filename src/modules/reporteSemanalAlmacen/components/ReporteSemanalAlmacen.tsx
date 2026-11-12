import { Box, Typography } from "@mui/material";
import { SharedTableEstadoVacio, SharedTableLoading } from "../../../shared/table";
import { useTextosReporteSemanal } from "../hooks/useTextosReporteSemanal";
import { useReporteSemanalAlmacen } from "../hooks/useReporteSemanalAlmacen";
import { ReporteSemanalBusqueda } from "./ReporteSemanalBusqueda";
import { ReporteSemanalFiltros } from "./ReporteSemanalFiltros";
import { ReporteSemanalGrupo } from "./ReporteSemanalGrupo";
import { moneda } from "../utils/reporteSemanalAlmacenFormato.utils";

export const ReporteSemanalAlmacen = (): JSX.Element => {
    const textos = useTextosReporteSemanal();
    const datos = useReporteSemanalAlmacen(textos.sinProveedor);

    return (
        <Box sx={{ mt: 3, width: "100%", position: "relative", minHeight: 240 }}>
            <SharedTableLoading visible={datos.cargando} />

            {/* Barra: buscador, periodo, semana y total de lo que se ve */}
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
                    deshabilitado={datos.cargando}
                />
                {datos.grupos.length > 0 && (
                    <Typography sx={{ fontSize: 13, ml: "auto" }}>
                        {textos.totalVista}: <b>{moneda(datos.totales.total)}</b> · {datos.totales.registros}{" "}
                        {textos.registros}
                    </Typography>
                )}
            </Box>

            {datos.reporte && datos.grupos.length > 0
                ? datos.grupos.map((grupo) => (
                    <ReporteSemanalGrupo
                        key={grupo.id}
                        grupo={grupo}
                        periodo={datos.reporte!.periodo}
                        textos={textos}
                    />
                ))
                : !datos.cargando && <SharedTableEstadoVacio mensaje={datos.error ?? textos.vacio} />}
        </Box>
    );
};