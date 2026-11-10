import type { Canje } from "types/canjeTypes";

export type CanjeAgrupado = Canje;

export type FilaCanje = Record<string, any> & {
  id: number;
  estado_validacion: string | null;
};

export type TipoProducto = "fisico" | "digital";

export type Visualizacion = "cuadricula" | "tabla";

export interface FiltrosCanjes {
  search?: string;
  fecha1?: string;
  fecha2?: string;
}

export interface EstadoValidacionVisual {
  label: string;
  bg: string;
  color: string;
  icon: JSX.Element;
}
