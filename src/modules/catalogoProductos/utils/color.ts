/** true si el navegador reconoce el texto como color CSS (nombre, hex, rgb…). */
export const esColorValido = (color: string): boolean => {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
};

/** Convierte un nombre de color ("red") a hex ("#ff0000"); si no puede, regresa el texto. */
export const colorNameToHex = (color: string): string => {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return color;
  ctx.fillStyle = color;
  const computed = ctx.fillStyle;
  return computed.startsWith("#") ? computed : color;
};

/** Hex para el color picker; negro si el texto no es un color válido. */
export const colorHex = (color: string): string =>
  esColorValido(color) ? colorNameToHex(color) : "#000000";

/** Estilo de texto para colores, tallas y montos desactivados. */
export const estiloInactivo = (status?: string) =>
  status === "INACTIVE"
    ? { color: "#7a7a7a", textDecoration: "line-through", textDecorationColor: "red" }
    : {};

const ESTADOS_RECURSO: Record<string, string> = {
  ACTIVE: "activado",
  INACTIVE: "desactivado",
};

export const traducirEstadoRecurso = (estado?: string | null): string =>
  !estado ? "sin estado" : ESTADOS_RECURSO[estado.toUpperCase()] ?? estado.toLowerCase();
