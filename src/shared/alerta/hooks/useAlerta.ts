import { useMemo } from "react";
import { ALERTA_DEFAULTS } from "../constants/alerta.constants";
import type { AlertaProps } from "../types/alerta.types";
import {
  crearEstilosAlerta,
  normalizarTipo,
  oscurecerSeguro,
  resolverIcono,
} from "../utils/alerta.utils";

/** Calcula el tipo, el icono y los estilos de la alerta */
export const useAlerta = ({
  tipo,
  icono,
  fondoAlert,
  hoverAlert,
  colorTexto,
  colorIcono,
  compacta = false,
}: AlertaProps) => {
  const tipoFinal = normalizarTipo(tipo);

  const iconoFinal = useMemo(
    () => resolverIcono(tipoFinal, icono, compacta),
    [tipoFinal, icono, compacta]
  );

  const estilos = useMemo(() => {
    const fondoHover =
      hoverAlert ??
      (fondoAlert ? oscurecerSeguro(fondoAlert, ALERTA_DEFAULTS.oscurecerHover) : undefined);

    return crearEstilosAlerta({
      compacta,
      fondo: fondoAlert,
      fondoHover,
      colorTexto,
      colorIcono,
    });
  }, [compacta, fondoAlert, hoverAlert, colorTexto, colorIcono]);

  return { tipo: tipoFinal, icono: iconoFinal, estilos };
};
