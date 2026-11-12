import type {
  EstilosBotonIcono,
  ParametrosEstiloBotonIcono,
} from "../types/botonIcono.types";

export const BOTON_ICONO_DEFAULTS = {
  fondoBoton: "#ffffff",
  colorTexto: "#344767",
  borde: "rgba(0, 0, 0, 0.12)",
  /** Oscurecimiento del hover cuando no se pasa fondoHover */
  oscurecerHover: 0.06,
  /** Mismo tamaño para ambos textos cuando vienen los dos */
  tamanoTextoDoble: 11,
  /** Tamaño cuando solo viene un texto */
  tamanoTextoSimple: 13,
} as const;

export const crearEstilosBotonIcono = ({
  variante,
  fondo,
  fondoHover,
  colorTexto,
  colorIcono,
}: ParametrosEstiloBotonIcono): EstilosBotonIcono => {
  const soloIcono = variante === "soloIcono";
  const dosTextos = variante === "dosTextos";

  return {
    boton: {
      display: "inline-flex",
      alignItems: "center",
      gap: soloIcono ? 0 : 0.75,
      px: soloIcono ? 0.5 : 1,
      py: 0.5,
      minHeight: 36,
      minWidth: soloIcono ? 36 : undefined,
      justifyContent: "center",
      border: `1px solid ${BOTON_ICONO_DEFAULTS.borde}`,
      borderRadius: "6px",
      background: fondo,
      color: colorTexto,
      transition: "background 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        background: fondoHover,
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.12)",
      },
      "&.Mui-focusVisible": {
        outline: `2px solid ${colorIcono}`,
        outlineOffset: 2,
      },
      "&.Mui-disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
    icono: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: colorIcono,
      flexShrink: 0,
    },
    contenedorTexto: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      textAlign: "left",
      minWidth: 0,
    },
    texto: dosTextos
      ? {
          display: "block",
          fontSize: BOTON_ICONO_DEFAULTS.tamanoTextoDoble,
          lineHeight: 1.2,
          fontWeight: 500,
          color: colorTexto,
          whiteSpace: "nowrap",
        }
      : {
          display: "block",
          fontSize: BOTON_ICONO_DEFAULTS.tamanoTextoSimple,
          lineHeight: 1.3,
          fontWeight: 600,
          color: colorTexto,
          whiteSpace: "nowrap",
        },
  };
};
