import { CanjeReporteItem, TotalesReporte } from "../types/reporteCanjes";

export const totalesKeyMap: Partial<Record<string, keyof TotalesReporte>> = {
    precio_sin_iva_puntos_prespuestado: "precio_sin_iva_puntos_prespuestado",
    precio_sin_iva_proveedor_prespuestado: "precio_sin_iva_proveedor_prespuestado",
    precio_compra_sin_iva: "precio_compra_sin_iva",
    diferencia_precio_usuario: "diferencia_precio_usuario",
    diferencia_precio_proveedor: "diferencia_precio_proveedor",
    fee_presupuestado_puntos: "fee_presupuestado_puntos",
    fee_presupuestado_proveedor_puntos: "fee_presupuestado_proveedor_puntos",
    fee_real: "fee_real",
    diferencia_precio_usuario_2: "diferencia_precio_usuario_2",
    diferencia_precio_proveedor_2: "diferencia_precio_proveedor_2",
    envio_presupuestado: "envio_presupuestado",
    costo_envio_real: "costo_envio_real",
    diferencia_envio: "diferencia_envio",
    total_presupuestado_puntos: "total_presupuestado_puntos",
    total_presupuestado_proveedor_puntos: "total_presupuestado_proveedor_puntos",
    total_real: "total_real",
    total_diferencia_puntos_usuario: "total_diferencia_puntos_usuario",
    total_diferencia_puntos_proveedor: "total_diferencia_puntos_proveedor",
};