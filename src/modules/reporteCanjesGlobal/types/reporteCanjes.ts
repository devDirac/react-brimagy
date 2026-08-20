export interface CanjeReporteItem {
  id: number;
  api_id: string;
  nombre: string;
  telefono: string;
  correo: string;
  calle: string;
  no_ext: string;
  no_int: string | null;
  colonia: string;
  municipio_delegacion: string;
  codigo_postal: string;
  entre_calles: string;
  referencia_adicional: string;
  folio_canje: string;
  category: string;
  premio: string;
  sku: string;
  talla: string;
  color: string;
  premios_canjeados: number;
  puntos_premio: number;
  puntos_canjeados: number;
  fecha_canje: string;
  fecha_compra: string | null;
  folio_factura: string | null;
  marca: string | null;
  imei: string | null;
  precio_sin_iva_puntos_prespuestado: number | string | null;
  precio_sin_iva_proveedor_prespuestado: number | string | null;
  precio_compra_sin_iva: number | string | null;
  diferencia_precio_usuario: number | null;
  diferencia_precio_proveedor: number | null;
  fee_presupuestado_puntos: number | null;
  fee_presupuestado_proveedor_puntos: number | null;
  fee_real: number | null;
  diferencia_precio_usuario_2: number | null;
  diferencia_precio_proveedor_2: number | null;
  envio_presupuestado: number | string | null;
  costo_envio_real: number | null;
  diferencia_envio: number | null;
  total_presupuestado_puntos: number | null;
  total_presupuestado_proveedor_puntos: number | null;
  total_real: number | null;
  total_diferencia_puntos_usuario: number | null;
  total_diferencia_puntos_proveedor: number | null;
}

export interface TotalesReporte {
  precio_sin_iva_puntos_prespuestado: number;
  precio_sin_iva_proveedor_prespuestado: number;
  precio_compra_sin_iva: number;
  diferencia_precio_usuario: number;
  diferencia_precio_proveedor: number;
  fee_presupuestado_puntos: number;
  fee_presupuestado_proveedor_puntos: number;
  fee_real: number;
  diferencia_precio_usuario_2: number;
  diferencia_precio_proveedor_2: number;
  envio_presupuestado: number;
  costo_envio_real: number;
  diferencia_envio: number;
  total_presupuestado_puntos: number;
  total_presupuestado_proveedor_puntos: number;
  total_real: number;
  total_diferencia_puntos_usuario: number;
  total_diferencia_puntos_proveedor: number;
  ahorro_precio_puntos_global: number;
  ahorro_precio_proveedor_global: number;
  ahorro_fee_puntos_global: number;
  ahorro_fee_proveedor_global: number;
  ahorro_envio_proveedor_global: number;
  ahorro_usuario_global: number;
  ahorro_proveedor_global: number;
}

export interface ReporteGeneralResponse {
  detalle: CanjeReporteItem[];
  totales: TotalesReporte;
}
