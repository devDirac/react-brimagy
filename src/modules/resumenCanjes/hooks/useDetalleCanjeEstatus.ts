import { useCallback, useState } from "react";
import type { CanjeEstatus } from "../types";

export const useDetalleCanjeEstatus = () => {
    const [verCanje, setVerCanje] = useState<CanjeEstatus | null>(null);
    const [abierto, setAbierto] = useState(false);
    const [pdfAbierto, setPdfAbierto] = useState(false);

    const abrir = useCallback((canje: CanjeEstatus) => {
        setVerCanje(canje);
        setAbierto(true);
    }, []);

    const cerrar = useCallback(() => {
        setAbierto(false);
        setPdfAbierto(false);
    }, []);

    const actualizarEstado = useCallback((idCanje: number, estado: string) => {
        setVerCanje((prev) =>
            prev && prev.id === idCanje ? { ...prev, estado_validacion: estado } : prev
        );
    }, []);

    return {
        verCanje,
        abierto,
        abrir,
        cerrar,
        pdfAbierto,
        abrirPdf: () => setPdfAbierto(true),
        cerrarPdf: () => setPdfAbierto(false),
        actualizarEstado,
    };
};