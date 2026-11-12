import { useMemo } from "react";
import type { BotonIconoProps } from "../types/botonIcono.types";
import { BOTON_ICONO_DEFAULTS, crearEstilosBotonIcono } from "../styles/botonIcono.styles";
import {
  construirFondo,
  obtenerTextos,
  obtenerVariante,
  oscurecerSeguro,
} from "../utils/botonIcono.utils";

/** Calcula variante, textos, estilos y si debe mostrarse el tooltip */
export const useBotonIcono = ({
  textoUno,
  textoDos,
  tooltipTexto,
  colorTexto,
  colorIcono,
  fondoBoton,
  fondoHover,
  degradado = false,
}: BotonIconoProps) => {
  const variante = obtenerVariante(textoUno, textoDos);
  const textos = obtenerTextos(variante, textoUno, textoDos);

  const estilos = useMemo(() => {
    const fondoBase = fondoBoton ?? BOTON_ICONO_DEFAULTS.fondoBoton;
    const fondoHoverBase =
      fondoHover ?? oscurecerSeguro(fondoBase, BOTON_ICONO_DEFAULTS.oscurecerHover);
    const colorTextoFinal = colorTexto ?? BOTON_ICONO_DEFAULTS.colorTexto;

    return crearEstilosBotonIcono({
      variante,
      fondo: construirFondo(fondoBase, degradado),
      fondoHover: construirFondo(fondoHoverBase, degradado),
      colorTexto: colorTextoFinal,
      colorIcono: colorIcono ?? colorTextoFinal,
    });
  }, [variante, fondoBoton, fondoHover, colorTexto, colorIcono, degradado]);

  const mostrarTooltip = variante === "soloIcono" && Boolean(tooltipTexto);

  return { variante, textos, estilos, mostrarTooltip };
};
