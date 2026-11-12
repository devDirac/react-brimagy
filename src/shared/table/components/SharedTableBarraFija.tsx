import type { RefObject } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import type { ControlSharedTabla } from "../types/sharedTable.types";
import type { ColoresTabla } from "../utils/tableStyles";

const LADO_BOTON = 30;

interface SharedTableBarraFijaProps<TFila> {
  control: ControlSharedTabla<TFila>;
  colores: ColoresTabla;
  darkMode: boolean;
  visible: boolean;
  refPista: RefObject<HTMLDivElement>;
  refPulgar: RefObject<HTMLDivElement>;
  hayDesbordeHorizontal: boolean;
  navegacion: boolean;
}

export const SharedTableBarraFija = <TFila,>({
  control,
  colores,
  darkMode,
  visible,
  refPista,
  refPulgar,
  hayDesbordeHorizontal,
  navegacion,
}: SharedTableBarraFijaProps<TFila>): JSX.Element => {
  const { tabla, total } = control;
  const { pageIndex, pageSize } = tabla.getState().pagination;

  const paginas = Math.max(1, tabla.getPageCount());
  const paginaActual = Math.min(Math.max(pageIndex + 1, 1), paginas);
  const hayAnterior = paginaActual > 1;
  const haySiguiente = paginaActual < paginas;

  const primero = total === 0 ? 0 : pageIndex * pageSize + 1;
  const ultimo = Math.min((pageIndex + 1) * pageSize, total);

  const colorTenue = darkMode ? "#94a3b8" : "#64748b";
  const colorFuerte = darkMode ? "#e2e8f0" : "#0f172a";
  const colorApagado = darkMode ? "rgba(255,255,255,0.2)" : "#cbd5e1";

  const estiloBoton = { width: LADO_BOTON, height: LADO_BOTON };

  return (
    <div
      aria-hidden={!visible}
      style={{
        overflow: "hidden",
        maxHeight: visible ? 88 : 0,
        opacity: visible ? 1 : 0,
        transition:
          "max-height 260ms cubic-bezier(0.2,0.8,0.3,1), opacity 160ms linear",
      }}
    >
      {hayDesbordeHorizontal && (
        <div className="px-3 pt-2 pb-1">
          <div
            ref={refPista}
            className="position-relative w-100 rounded-pill"
            style={{
              height: 8,
              cursor: "pointer",
              backgroundColor: darkMode ? "#232b3e" : "#dbe3ee",
            }}
          >
            <div
              ref={refPulgar}
              className="sharedtabla-pulgar position-absolute top-0 start-0 rounded-pill"
              style={{
                height: 8,
                width: 0,
                backgroundColor: darkMode ? "#5a6a86" : "#8fa2bb",
                touchAction: "none",
              }}
            />
          </div>
        </div>
      )}

      {navegacion && (
        <div
          className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-4"
          style={{ borderBottom: `1px solid ${colores.borde}`, paddingTop: 6, paddingBottom: 6 }}
        >
          <span
            className="text-nowrap"
            style={{ fontSize: 12.5, color: colorTenue }}
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
              onClick={() => tabla.setPageIndex(pageIndex - 1)}
              className="d-flex align-items-center justify-content-center border-0 bg-transparent p-0"
              style={{
                ...estiloBoton,
                borderRadius: 9,
                cursor: hayAnterior ? "pointer" : "default",
                color: hayAnterior ? colorFuerte : colorApagado,
                opacity: hayAnterior ? 1 : 0.55,
              }}
            >
              <ChevronLeftRoundedIcon sx={{ fontSize: 20 }} />
            </button>

            <span
              className="text-nowrap px-1"
              style={{ fontSize: 12.5, color: colorTenue }}
            >
              Página{" "}
              <b style={{ color: colorFuerte }}>{paginaActual}</b> de{" "}
              <b style={{ color: colorFuerte }}>{paginas}</b>
            </span>

            <button
              type="button"
              aria-label="Página siguiente"
              disabled={!haySiguiente}
              onClick={() => tabla.setPageIndex(pageIndex + 1)}
              className="d-flex align-items-center justify-content-center border-0 bg-transparent p-0"
              style={{
                ...estiloBoton,
                borderRadius: 9,
                cursor: haySiguiente ? "pointer" : "default",
                color: haySiguiente ? colorFuerte : colorApagado,
                opacity: haySiguiente ? 1 : 0.55,
              }}
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};