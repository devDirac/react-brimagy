import type { FilterFn } from "@tanstack/react-table";
import {
    ESTADO_CANJE_INACTIVO,
    ESTADO_VALIDADO,
    ESTATUS_CANJE,
    RUTAS_TIPO_PRODUCTO,
} from "../constants";
import type { CanjeEstatus, ConfigEstatusCanje, EstatusCanje, TipoProductoCanje } from "../types";

export const tipoProductoDesdeRuta = (pathname: string): TipoProductoCanje | undefined => {
    if (pathname.includes(RUTAS_TIPO_PRODUCTO.digital)) return "digital";
    if (pathname.includes(RUTAS_TIPO_PRODUCTO.fisico)) return "fisico";
    return undefined;
};

export const getConfigEstatus = (clave: EstatusCanje): ConfigEstatusCanje =>
    ESTATUS_CANJE.find((e) => e.clave === clave) ?? ESTATUS_CANJE[0];

export const productosRegistrados = (canje: CanjeEstatus) =>
    canje.productos.filter((p) => !!p.id_producto);

export const motivoNoValidable = (canje: CanjeEstatus): string | null => {
    if (canje.estado_validacion === ESTADO_VALIDADO) return "El canje ya está validado";
    if (canje.estado_canje?.toUpperCase() === ESTADO_CANJE_INACTIVO) return "El canje está inactivo";
    if (productosRegistrados(canje).length === 0) {
        return "Ningún producto del canje está registrado en el catálogo";
    }
    return null;
};

export const armarPayloadValidacion = (canje: CanjeEstatus, plataforma: string) => ({
    plataforma,
    ...canje,
    productos: productosRegistrados(canje),
});

export const filtroGlobalCanje: FilterFn<CanjeEstatus> = (row, _columnId, valor) => {
    const termino = String(valor ?? "")
        .trim()
        .toLowerCase();
    if (!termino) return true;

    const c = row.original;
    const campos = [
        c.folio,
        c.nombre_usuario,
        c.email,
        c.phone,
        ...c.productos.flatMap((p) => [p.nombre_premio, p.sku, p.sku_catalogo]),
    ];

    return campos.some((campo) =>
        String(campo ?? "")
            .toLowerCase()
            .includes(termino)
    );
};

export const paginasVisibles = (
    actual: number,
    total: number,
    visibles: number
): (number | null)[] => {
    if (total <= visibles + 2) return Array.from({ length: total }, (_, i) => i);

    const mitad = Math.floor(visibles / 2);
    const inicio = Math.min(Math.max(actual - mitad, 1), total - 1 - visibles);
    const centro = Array.from({ length: visibles }, (_, i) => inicio + i);

    const fin = inicio + visibles;
    const huecoIzquierdo = inicio === 2 ? [1] : inicio > 2 ? [null] : [];
    const huecoDerecho = fin === total - 2 ? [total - 2] : fin < total - 2 ? [null] : [];

    return [0, ...huecoIzquierdo, ...centro, ...huecoDerecho, total - 1];
};