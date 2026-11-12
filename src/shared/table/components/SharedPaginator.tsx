import { MenuItem, Select } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useMaterialUIController } from "context";

const LADO_BOTON = 36;
const ELIPSIS = "…";
const PAGINAS_SIN_ELIPSIS = 7;

export const OPCIONES_POR_PAGINA: readonly number[] = [10, 20, 50, 100];

const construirPaginas = (
    paginaActual: number,
    totalPaginas: number
): (number | typeof ELIPSIS)[] => {
    if (totalPaginas <= PAGINAS_SIN_ELIPSIS) {
        return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
    }

    const paginas: (number | typeof ELIPSIS)[] = [1];
    const inicio = Math.max(2, paginaActual - 1);
    const fin = Math.min(totalPaginas - 1, paginaActual + 1);

    if (inicio > 2) {
        paginas.push(ELIPSIS);
    }

    for (let pagina = inicio; pagina <= fin; pagina += 1) {
        paginas.push(pagina);
    }

    if (fin < totalPaginas - 1) {
        paginas.push(ELIPSIS);
    }

    paginas.push(totalPaginas);

    return paginas;
};

interface SharedPaginatorProps {
    indicePagina: number;
    tamanoPagina: number;
    total: number;
    totalPaginas: number;
    opcionesPorPagina?: readonly number[];
    deshabilitado?: boolean;
    onCambiarPagina: (indicePagina: number) => void;
    onCambiarTamanoPagina: (tamanoPagina: number) => void;
}

export const SharedPaginator = ({
    indicePagina,
    tamanoPagina,
    total,
    totalPaginas,
    opcionesPorPagina = OPCIONES_POR_PAGINA,
    deshabilitado = false,
    onCambiarPagina,
    onCambiarTamanoPagina,
}: SharedPaginatorProps): JSX.Element => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const paginas = Math.max(1, totalPaginas);
    const paginaActual = Math.min(Math.max(indicePagina + 1, 1), paginas);

    const hayAnterior = !deshabilitado && paginaActual > 1;
    const haySiguiente = !deshabilitado && paginaActual < paginas;

    const primero = total === 0 ? 0 : indicePagina * tamanoPagina + 1;
    const ultimo = Math.min((indicePagina + 1) * tamanoPagina, total);

    const colorTenue = darkMode ? "#94a3b8" : "#64748b";
    const colorFuerte = darkMode ? "#e2e8f0" : "#0f172a";
    const colorPagina = darkMode ? "#cbd5e1" : "#1e293b";
    const colorActivoFondo = darkMode ? "#0047AB" : "#0f172a";
    const colorBorde = darkMode ? "rgba(255,255,255,0.2)" : "#cbd5e1";
    const colorHover = darkMode ? "rgba(255,255,255,0.08)" : "#f1f5f9";

    const estiloBoton = {
        width: LADO_BOTON,
        height: LADO_BOTON,
    };

    return (
        <div
            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-3 px-4"
            style={{ paddingTop: 10, paddingBottom: 10 }}
        >
            <span
                className="text-nowrap"
                style={{ fontSize: 13, color: colorTenue }}
            >
                Mostrando{" "}
                <b style={{ color: colorFuerte }}>
                    {primero}
                    {"–"}
                    {ultimo}
                </b>{" "}
                de <b style={{ color: colorFuerte }}>{total}</b>
            </span>

            <div className="d-flex align-items-center gap-1">
                <button
                    type="button"
                    aria-label="Página anterior"
                    disabled={!hayAnterior}
                    onClick={() => onCambiarPagina(indicePagina - 1)}
                    className="d-flex align-items-center justify-content-center border-0 bg-transparent p-0"
                    style={{
                        ...estiloBoton,
                        borderRadius: 10,
                        color: hayAnterior ? colorPagina : colorBorde,
                        opacity: hayAnterior ? 1 : 0.55,
                        cursor: hayAnterior ? "pointer" : "default",
                    }}
                >
                    <ChevronLeftRoundedIcon sx={{ fontSize: 22 }} />
                </button>

                {construirPaginas(paginaActual, paginas).map((pagina, indice) =>
                    pagina === ELIPSIS ? (
                        <span
                            key={`elipsis-${indice}`}
                            className="d-flex align-items-end justify-content-center"
                            style={{ ...estiloBoton, fontSize: 14, color: colorTenue }}
                        >
                            {ELIPSIS}
                        </span>
                    ) : (
                        <button
                            key={pagina}
                            type="button"
                            aria-label={`Página ${pagina}`}
                            aria-current={pagina === paginaActual ? "page" : undefined}
                            disabled={deshabilitado}
                            onClick={() => onCambiarPagina(pagina - 1)}
                            className="d-flex align-items-center justify-content-center border-0 p-0"
                            style={{
                                ...estiloBoton,
                                borderRadius: 10,
                                fontSize: 14,
                                cursor: deshabilitado ? "default" : "pointer",
                                transition: "background-color 150ms linear",
                                fontWeight: pagina === paginaActual ? 700 : 500,
                                color: pagina === paginaActual ? "#ffffff" : colorPagina,
                                backgroundColor:
                                    pagina === paginaActual ? colorActivoFondo : "transparent",
                            }}
                            onMouseEnter={(evento) => {
                                if (pagina !== paginaActual) {
                                    evento.currentTarget.style.backgroundColor = colorHover;
                                }
                            }}
                            onMouseLeave={(evento) => {
                                if (pagina !== paginaActual) {
                                    evento.currentTarget.style.backgroundColor = "transparent";
                                }
                            }}
                        >
                            {pagina}
                        </button>
                    )
                )}

                <button
                    type="button"
                    aria-label="Página siguiente"
                    disabled={!haySiguiente}
                    onClick={() => onCambiarPagina(indicePagina + 1)}
                    className="d-flex align-items-center justify-content-center border-0 bg-transparent p-0"
                    style={{
                        ...estiloBoton,
                        borderRadius: 10,
                        color: haySiguiente ? colorPagina : colorBorde,
                        opacity: haySiguiente ? 1 : 0.55,
                        cursor: haySiguiente ? "pointer" : "default",
                    }}
                >
                    <ChevronRightRoundedIcon sx={{ fontSize: 22 }} />
                </button>
            </div>

            <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: 13, color: colorTenue }}>Filas</span>

                <Select
                    size="small"
                    value={tamanoPagina}
                    disabled={deshabilitado}
                    onChange={(evento) => onCambiarTamanoPagina(Number(evento.target.value))}
                    sx={{
                        height: LADO_BOTON,
                        fontSize: 14,
                        fontWeight: 700,
                        borderRadius: "10px",
                        color: colorFuerte,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: colorBorde },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: colorPagina,
                        },
                    }}
                >
                    {opcionesPorPagina.map((opcion) => (
                        <MenuItem key={opcion} value={opcion} sx={{ fontSize: 14 }}>
                            {opcion}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    );
};