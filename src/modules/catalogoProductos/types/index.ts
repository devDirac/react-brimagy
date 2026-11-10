/** Producto tal como lo regresa getCatalogoProductos. */
export interface Producto {
  id: number;
  nombre_producto?: string;
  descripcion?: string;
  marca?: string;
  sku?: string;
  color?: string;
  talla?: string;
  catalogo?: string;
  proveedor?: string;
  tipo_producto?: string;
  nombre_plataforma?: string;
  plataforma?: string;
  stock?: number;
  factor?: number;
  required_score?: number;
  foto_producto?: string;
  id_producto_brimagy?: number | string;
  [campo: string]: any;
}

export type VariablesGlobales = {
  fee_brimagy: number;
  envio_base: number;
  costo_caja: number;
  envio_extra: number;
  factor: number;
} | null;

/** Color, talla, monto o foto asociada a un producto. */
export interface RecursoProducto {
  id: number;
  status: string;
  [campo: string]: any;
}

/** Fila leída del Excel de carga masiva, ya validada contra los catálogos. */
export interface ProductoExcel {
  id: number;
  fila: number;
  id_catalogo: number | null;
  catalogo: string;
  nombre_producto: string;
  descripcion: string;
  marca: string;
  proveedor: string;
  id_proveedor: number | null;
  sku: string;
  color: string;
  talla: any;
  costo_con_iva: number;
  costo_puntos_con_iva: number;
  fee_brimagy: number;
  valor_factor: number;
  envio_extra: number;
  tipo_producto: any;
  proveedor_valido: boolean;
  proveedor_vacio: boolean;
  categoria_valida: boolean;
  plataforma_valida: boolean;
  sku_duplicado: boolean;
  id_producto_brimagy_duplicado: boolean;
  sku_vacio: boolean;
  id_producto_brimagy_vacio: boolean;
  plataforma: string;
  id_producto_brimagy: any;
}

/** Proveedores, categorías y plataformas contra los que se valida el Excel. */
export interface Catalogos {
  proveedores: any[];
  categorias: any[];
  plataformas: any[];
}

export type TipoCatalogo = "digital" | "fisico" | "todos";

export type Visualizacion = "cuadricula" | "tabla";

export interface FiltrosProductos {
  search?: string;
  fecha1?: string;
  fecha2?: string;
}

export type PestanaEdicion = "one" | "two" | "three" | "four" | "five" | "six" | "seven";
