import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getErrorHttpMessage } from "utils";
import { getCanjesPorEstatusHttp } from "actions/canjes";
import { agruparCanjes, ordenarPendientesPrimero } from "modules/listadoCanjes/utils";
import type { FilaCanje } from "modules/listadoCanjes/types";
import type { CanjeEstatus, EstatusCanje, TipoProductoCanje } from "../types";

interface Params {
    estatus: EstatusCanje | null;
    plataforma: string;
    tipoProducto?: TipoProductoCanje;
}

export const useCanjesPorEstatus = ({ estatus, plataforma, tipoProducto }: Params) => {
    const [filas, setFilas] = useState<FilaCanje[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const ultimaPeticion = useRef(0);

    const cargar = useCallback(async () => {
        if (!estatus) return;
        const idPeticion = ++ultimaPeticion.current;

        try {
            setCargando(true);
            setError(null);
            const respuesta = await getCanjesPorEstatusHttp(estatus, plataforma, tipoProducto);
            if (idPeticion === ultimaPeticion.current) {
                setFilas(Array.isArray(respuesta) ? (respuesta as FilaCanje[]) : []);
            }
        } catch (e) {
            if (idPeticion === ultimaPeticion.current) {
                setFilas([]);
                setError(getErrorHttpMessage(e) || "Error al obtener los canjes");
            }
        } finally {
            if (idPeticion === ultimaPeticion.current) setCargando(false);
        }
    }, [estatus, plataforma, tipoProducto]);

    useEffect(() => {
        if (estatus) {
            cargar();
        } else {
            setFilas([]);
        }
    }, [cargar, estatus]);

    const canjes: CanjeEstatus[] = useMemo(
        () => ordenarPendientesPrimero(agruparCanjes(filas)),
        [filas]
    );

    return { canjes, cargando, error, recargar: cargar };
};