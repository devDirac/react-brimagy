import { useMemo } from "react";
import { useIntl } from "react-intl";
import type { TextosReporteSemanal } from "../types/reporteSemanalAlmacen.types";

/** Textos del módulo; se recalculan solo al cambiar de idioma. */
export const useTextosReporteSemanal = (): TextosReporteSemanal => {
    const intl = useIntl();

    return useMemo(() => {
        const t = (id: string, defaultMessage: string) => intl.formatMessage({ id, defaultMessage });
        return {
            proveedor: t("reporte_semanal_proveedor", "Proveedor"),
            sinProveedor: t("reporte_semanal_sin_proveedor", "Sin proveedor"),
            periodo: t("reporte_semanal_periodo", "Periodo"),
            activo: t("reporte_semanal_activo", "activo"),
            semana: t("reporte_semanal_semana", "Semana"),
            todas: t("reporte_semanal_todo_periodo", "Todo el periodo"),
            buscar: t("input_buscador", "Buscar…"),
            vacio: t("reporte_semanal_sin_registros", "Sin registros en esta semana"),
            producto: t("reporte_semanal_producto", "Producto"),
            sku: t("reporte_semanal_sku", "SKU"),
            precio: t("reporte_semanal_precio", "Precio"),
            cantidadGestionada: t("reporte_semanal_cantidad", "Cantidad"),
            entrega: t("reporte_semanal_entrega", "Entrega"),
            faltante: t("reporte_semanal_faltante", "Faltante"),
            notas: t("reporte_semanal_notas", "Notas"),
            fechaFactura: t("reporte_semanal_fecha_factura", "Fecha de factura"),
            marca: t("reporte_semanal_marca", "Marca"),
            precioUnitarioCompra: t("reporte_semanal_precio_unitario", "P. unitario compra"),
            total: t("reporte_semanal_total", "Total"),
            totalProveedor: t("reporte_semanal_total_proveedor", "Total del proveedor"),
            totalVista: t("reporte_semanal_total_vista", "Total"),
            registros: t("reporte_semanal_registros", "registros"),
            folio: t("reporte_semanal_folio", "Folio"),
        };
    }, [intl.locale]);
};