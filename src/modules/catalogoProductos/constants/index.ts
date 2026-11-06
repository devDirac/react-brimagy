export const COLORES = {
  primario: "#084d6e",
  verde: "#a5eb2f",
  rosa: "#eb2fa5",
  oscuro: "#2f2f2f",
};

export const TALLAS = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

export const OPCIONES_POR_PAGINA = [3, 6, 9, 12];
export const POR_PAGINA_INICIAL = 12;
export const RETRASO_BUSQUEDA_MS = 500;

/** Valor de stock que el backend usa para "disponible". */
export const STOCK_DISPONIBLE = 1000000;

export const REGEX_DECIMAL_8_4 = /^\d{1,8}(\.\d{1,4})?$/; // hasta 8 enteros, 4 decimales
export const REGEX_VALOR_FACTOR = /^\d{1,3}(\.\d{1,2})?$/; // hasta 3 enteros, 2 decimales

/** Variables que se usan cuando la plataforma no tiene variables globales registradas. */
export const variablesPorDefecto = (plataforma: string) => ({
  envio_base: 180,
  costo_caja: 19,
  envio_extra: 0,
  fee_brimagy: plataforma === "club bohn" ? 15 : 12,
  // Igual que en el backend: sin variables globales, el factor por defecto es 15
  factor: 15,
});

export const MIME_EXCEL = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const ACEPTA_IMAGENES = ".jpg,.jpeg,.png,image/jpeg,image/png";
