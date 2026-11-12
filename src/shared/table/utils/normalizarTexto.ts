export const normalizarTexto = (valor: unknown): string => {
    if (valor === null || valor === undefined) return "";

    return String(valor)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quita los diacríticos
        .toLowerCase()
        .trim();
};

/** true si `texto` contiene todas las palabras de `busqueda`, sin importar acentos. */
export const coincideBusqueda = (texto: unknown, busqueda: string): boolean => {
    const objetivo = normalizarTexto(texto);
    const termino = normalizarTexto(busqueda);

    if (!termino) return true;

    return termino.split(/\s+/).every((palabra) => objetivo.includes(palabra));
};