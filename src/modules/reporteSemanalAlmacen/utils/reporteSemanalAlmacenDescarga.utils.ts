import { getErrorHttpMessage } from "utils";

/** Descarga un blob en el navegador con el nombre indicado. */
export const descargarBlob = (datos: BlobPart, nombre: string): void => {
    const url = window.URL.createObjectURL(new Blob([datos]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nombre);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

/**
 * Mensaje de error de una descarga
 */
export const mensajeErrorDescarga = async (error: any, mensajePorDefecto: string): Promise<string> => {
    const datos = error?.response?.data;

    if (datos instanceof Blob) {
        try {
            const parsed = JSON.parse(await datos.text());
            return parsed?.message || mensajePorDefecto;
        } catch {
            return mensajePorDefecto;
        }
    }

    return getErrorHttpMessage(error) || mensajePorDefecto;
};