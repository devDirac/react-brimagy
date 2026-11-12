import { memo } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { IconBuildingStore } from "@tabler/icons-react";
import { SharedTable } from "../../../shared/table";
import type {
    GrupoProveedor,
    PeriodoReporte,
    TextosReporteSemanal,
} from "../types/reporteSemanalAlmacen.types";
import { useTablaReporteSemanal } from "../hooks/useTablaReporteSemanal";
import { ANCHO_MINIMO_REPORTE } from "../constants/reporteSemanalAlmacen.constants";
import { moneda, rangoFechas } from "../utils/reporteSemanalAlmacenFormato.utils";

interface ReporteSemanalGrupoProps {
    grupo: GrupoProveedor;
    periodo: PeriodoReporte;
    textos: TextosReporteSemanal;
}

const ReporteSemanalGrupoBase = ({ grupo, periodo, textos }: ReporteSemanalGrupoProps): JSX.Element => {
    const control = useTablaReporteSemanal(grupo, textos);
    const registroTexto = grupo.totales.registros > 1 ? "productos" : "producto"

    return (
        <Box sx={{ mb: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 1.5,
                    px: 0.5,
                    mb: 1,
                }}
            >
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconBuildingStore size={20} stroke={1.8} />
                        <Typography sx={{ fontSize: 17, fontWeight: 800 }}>{grupo.nombreProveedor}</Typography>
                        <Chip
                            size="small"
                            label={grupo.semana.etiqueta.toUpperCase()}
                            sx={{ fontWeight: 700, fontSize: 11, color: "#fff", backgroundColor: "#041d45" }}
                        />
                    </Box>
                    <Typography sx={{ fontSize: 12.5 }} color="text.secondary">
                        {rangoFechas(grupo.semana.fechaInicio, grupo.semana.fechaFin)}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                        size="small"
                        label={`${grupo.totales.registros} ${registroTexto}`}
                        sx={{ fontWeight: 600, fontSize: 11 }}
                    />
                    <Chip
                        size="small"
                        label={moneda(grupo.totales.total)}
                        sx={{ fontWeight: 700, fontSize: 11, color: "#fff", backgroundColor: "#041d45" }}
                    />
                </Box>
            </Box>

            <SharedTable
                control={control}
                paginador={false}
                anchoMinimo={ANCHO_MINIMO_REPORTE}
                mensajeVacio={textos.vacio}
            />
        </Box>
    );
};

export const ReporteSemanalGrupo = memo(ReporteSemanalGrupoBase);