import { variablesPorDefecto } from "../constants";
import type { VariablesGlobales } from "../types";

const tieneValor = (valor: unknown) =>
  valor !== null &&
  valor !== undefined &&
  !["", "null", "undefined"].includes(String(valor).trim());

const numero = (valor: unknown) => (tieneValor(valor) && !isNaN(Number(valor)) ? Number(valor) : 0);

/**
 * Igual que el backend: con variables, fee/envío base/caja salen de ellas;
 * envio_extra y factor caen al valor por defecto si la variable está vacía.
 */
const resolverVariables = (variables: VariablesGlobales, plataforma: string) => {
  const porDefecto = variablesPorDefecto(plataforma);
  if (!variables) return porDefecto;

  return {
    fee_brimagy: numero(variables.fee_brimagy),
    envio_base: numero(variables.envio_base),
    costo_caja: numero(variables.costo_caja),
    envio_extra: tieneValor(variables.envio_extra) ? numero(variables.envio_extra) : porDefecto.envio_extra,
    factor: tieneValor(variables.factor) ? numero(variables.factor) : porDefecto.factor,
  };
};

/** Estima los costos de un producto a partir de su required_score (para exportar a Excel). */
export const reconstruirCostosDesdeRequiredScore = (
  requiredScore: number,
  plataforma: string,
  variables: VariablesGlobales
) => {
  const redondeo = requiredScore / 15;
  const total = redondeo - 1;
  const { fee_brimagy, envio_base, costo_caja, envio_extra } = resolverVariables(
    variables,
    plataforma
  );

  const total_envio = envio_base + costo_caja + envio_extra;
  const subtotal = total - total_envio;
  const costo_puntos_sin_iva = Math.round(subtotal / (1 + fee_brimagy / 100));
  const costo_puntos_con_iva = Math.round(costo_puntos_sin_iva * 1.16);

  return { redondeo, total, total_envio, subtotal, costo_puntos_sin_iva, costo_puntos_con_iva };
};

interface EnvioYFactor {
  envio_extra?: unknown;
  valor_factor?: unknown;
}

/**
 * Misma regla que ReglasEnvioYFactor::paraEdicion del backend, campo por campo:
 * lo capturado (aunque sea 0) → lo que ya tiene el producto → variables → por defecto.
 */
const resolverEnvioYFactorEdicion = (
  capturado: EnvioYFactor,
  guardado: EnvioYFactor,
  base: ReturnType<typeof resolverVariables>
) => {
  const elegir = (campo: keyof EnvioYFactor, delaBase: number) => {
    if (tieneValor(capturado[campo])) return numero(capturado[campo]);
    if (tieneValor(guardado[campo])) return numero(guardado[campo]);
    return delaBase;
  };

  return {
    envio_extra: elegir("envio_extra", base.envio_extra),
    valor_factor: elegir("valor_factor", base.factor),
  };
};

/**
 * Puntos que tendrá el producto con lo capturado en el formulario de edición.
 * Reproduce la fórmula de CalculadoraPuntos del backend para que el número coincida.
 */
export const calcularPuntosEsperados = (
  costoPuntosConIva: unknown,
  capturado: EnvioYFactor,
  guardado: EnvioYFactor,
  variables: VariablesGlobales,
  plataforma: string
) => {
  const costo = numero(costoPuntosConIva);
  if (!costo) return null;

  const base = resolverVariables(variables, plataforma);
  const { envio_extra, valor_factor } = resolverEnvioYFactorEdicion(capturado, guardado, base);

  const costo_puntos_sin_iva = costo / 1.16;
  const subtotal = costo_puntos_sin_iva + costo_puntos_sin_iva * (base.fee_brimagy / 100);
  const total_envio = base.envio_base + base.costo_caja + envio_extra;
  const total = subtotal + total_envio;
  // PHP aplica % sobre la parte entera
  const puntos = Math.trunc(total) % 2 !== 0 ? total + 2 : total + 1;
  const factor = valor_factor === 0 ? Math.round(total) : Math.round(total * valor_factor);

  return { costo_puntos_sin_iva, total_envio, subtotal, total, puntos, factor, envio_extra, valor_factor };
};
