import { CAMPOS_PRODUCTO, ESTADO_VALIDADO, ORDEN_ESTADOS } from "../constants";
import type { CanjeAgrupado, FilaCanje } from "../types";

export const calcularEstadoGrupo = (productos: any[]): string | null => {
  const unicos = Array.from(
    new Set(productos.map((p) => p.estado_validacion?.toLowerCase() ?? null))
  );
  if (unicos.length === 1) return unicos[0];

  if (unicos.includes(ESTADO_VALIDADO)) return "validacion_parcial";

  return ORDEN_ESTADOS.find((e) => unicos.includes(e)) ?? null;
};

export const agruparCanjes = (filas: FilaCanje[]): CanjeAgrupado[] => {
  const mapa = new Map<number, any>();

  filas.forEach((fila) => {
    const producto: any = {};
    CAMPOS_PRODUCTO.forEach((k) => (producto[k] = fila[k] ?? null));

    const existente = mapa.get(fila.id);
    if (existente) {
      existente.productos.push(producto);
    } else {
      const canje: any = { ...fila };
      CAMPOS_PRODUCTO.forEach((k) => delete canje[k]);
      mapa.set(fila.id, { ...canje, productos: [producto] });
    }
  });

  return Array.from(mapa.values()).map((c) => ({
    ...c,
    estado_validacion: calcularEstadoGrupo(c.productos),
    total_puntos: c.productos.reduce(
      (acc: number, p: any) => acc + Number(p.puntos_canjeados || 0),
      0
    ),
    total_premios: c.productos.reduce(
      (acc: number, p: any) => acc + Number(p.number_of_awards || 0),
      0
    ),
  }));
};

// Deja los canjes ya validados al final
export const ordenarPendientesPrimero = (canjes: CanjeAgrupado[]): CanjeAgrupado[] =>
  [...canjes].sort((a, b) => {
    const aValidado = a.estado_validacion === ESTADO_VALIDADO ? 1 : 0;
    const bValidado = b.estado_validacion === ESTADO_VALIDADO ? 1 : 0;
    return aValidado - bValidado;
  });
