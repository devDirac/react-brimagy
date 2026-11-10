import { useEffect, useMemo, useState } from "react";
import { POR_PAGINA_INICIAL } from "../constants";

/** Paginación local para la vista de cuadrícula. */
export const usePaginacion = <T>(elementos: T[]) => {
  const [pagina, setPagina] = useState(0);
  const [porPagina, setPorPagina] = useState(POR_PAGINA_INICIAL);

  // Si una búsqueda deja menos resultados, regresa a una página que exista
  useEffect(() => {
    const ultima = Math.max(Math.ceil(elementos.length / porPagina) - 1, 0);
    if (pagina > ultima) setPagina(ultima);
  }, [elementos.length, pagina, porPagina]);

  const paginados = useMemo(
    () => elementos.slice(pagina * porPagina, pagina * porPagina + porPagina),
    [elementos, pagina, porPagina]
  );

  const cambiarPorPagina = (n: number) => {
    setPorPagina(n);
    setPagina(0);
  };

  return { pagina, porPagina, paginados, setPagina, cambiarPorPagina };
};
