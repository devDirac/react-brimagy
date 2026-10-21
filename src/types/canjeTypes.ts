export interface ProductoCanje {
    id_producto: number;
    id_proveedor: number | null;
    nombre_premio: string;
    sku: string;
    sku_catalogo: string;
    size: string;
    color: string;
    category: string;
    number_of_awards: number | string;
    costo_premio: number | string;
    puntos_canjeados: number | string;
    estado_validacion: string | null;
}

export interface Canje {
    id: number;
    folio: string;
    nombre_usuario: string;
    email: string;
    phone: number | string | null;
    calle: string;
    numero_calle: string;
    colonia: string;
    codigo_postal: number | string;
    municipio: string;
    numero_interior: string;
    between_1: string;
    between_2: string;
    referencia_adicional: string;
    creacion_canje: string;
    estado_canje: string;
    estado_validacion: string | null;
    productos: ProductoCanje[];
    total_puntos: number;
    total_premios: number;
}