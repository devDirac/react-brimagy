import { memo } from "react";
import { MenuItem, TextField } from "@mui/material";
import type {
    OpcionPeriodo,
    ReporteSemanalAlmacen,
    SemanaSeleccionada,
} from "../types/reporteSemanalAlmacen.types";
import { SEMANA_TODAS } from "../constants/reporteSemanalAlmacen.constants";
import { rangoFechas } from "../utils/reporteSemanalAlmacenFormato.utils";

interface ReporteSemanalFiltrosProps {
    periodos: OpcionPeriodo[];
    idPeriodo: number | null;
    onCambiarPeriodo: (idPeriodo: number | null) => void;
    reporte: ReporteSemanalAlmacen | null;
    semana: SemanaSeleccionada;
    onCambiarSemana: (semana: SemanaSeleccionada) => void;
    textoPeriodo: string;
    textoActivo: string;
    textoSemana: string;
    textoTodas: string;
    deshabilitado?: boolean;
}

const estiloSelect = (ancho: number) => ({
    minWidth: ancho,
    "& .MuiInputBase-root": { height: 40, fontSize: 13 },
});

/** Selects compactos de periodo y semana; van en la barra de acciones de la tabla. */
const ReporteSemanalFiltrosBase = ({
    periodos,
    idPeriodo,
    onCambiarPeriodo,
    reporte,
    semana,
    onCambiarSemana,
    textoPeriodo,
    textoActivo,
    textoSemana,
    textoTodas,
    deshabilitado = false,
}: ReporteSemanalFiltrosProps): JSX.Element => (
    <>
        <TextField
            select
            size="small"
            label={textoPeriodo}
            value={idPeriodo ?? ""}
            disabled={deshabilitado || periodos.length === 0}
            onChange={(e) => onCambiarPeriodo(e.target.value === "" ? null : Number(e.target.value))}
            sx={estiloSelect(230)}
        >
            {periodos.map((p) => (
                <MenuItem key={p.id} value={p.id} sx={{ fontSize: 13 }}>
                    {rangoFechas(p.fechaInicio, p.fechaFin)}
                    {p.activo ? ` (${textoActivo})` : ""}
                </MenuItem>
            ))}
        </TextField>

        <TextField
            select
            size="small"
            label={textoSemana}
            value={reporte ? semana : ""}
            disabled={deshabilitado || !reporte}
            onChange={(e) => {
                const valor = e.target.value;
                onCambiarSemana(valor === SEMANA_TODAS ? SEMANA_TODAS : Number(valor));
            }}
            sx={estiloSelect(250)}
        >
            {reporte && (
                <MenuItem value={SEMANA_TODAS} sx={{ fontSize: 13, fontWeight: 600 }}>
                    {textoTodas} ({reporte.totales.registros})
                </MenuItem>
            )}
            {reporte?.semanas.map((s) => (
                <MenuItem key={s.numero} value={s.numero} sx={{ fontSize: 13 }}>
                    {s.etiqueta} · {rangoFechas(s.fechaInicio, s.fechaFin)} ({s.totales.registros})
                </MenuItem>
            ))}
        </TextField>
    </>
);

export const ReporteSemanalFiltros = memo(ReporteSemanalFiltrosBase);