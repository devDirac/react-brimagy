import { useCallback, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { getErrorHttpMessage } from "utils";

/** Mensaje para un error: id de react-intl (con fallback al mensaje HTTP) o función propia. */
export type MensajeError = string | ((error: unknown) => string);

/**
 * Loader global (Backdrop) y manejo de errores en un solo lugar.
 * Cuenta las peticiones en curso para que una carga rápida no oculte el loader de otra más lenta.
 */
export const useCargando = (mostrarAlerta: (mensaje: string) => void) => {
  const intl = useIntl();
  // react-intl entrega un objeto nuevo cuando App se re-renderiza (scroll del navbar);
  // con la ref, `ejecutar` no cambia de identidad por eso.
  const intlRef = useRef(intl);
  intlRef.current = intl;

  const [enCurso, setEnCurso] = useState(0);

  const mensajeDeError = useCallback((error: unknown, mensaje: MensajeError) => {
    if (typeof mensaje === "function") return mensaje(error);
    return getErrorHttpMessage(error) || intlRef.current.formatMessage({ id: mensaje });
  }, []);

  /** Ejecuta `tarea` con el loader visible. Si falla, muestra la alerta y regresa undefined. */
  const ejecutar = useCallback(
    async <T>(
      tarea: () => Promise<T>,
      mensaje: MensajeError = "get_elementos_error"
    ): Promise<T | undefined> => {
      setEnCurso((n) => n + 1);
      try {
        return await tarea();
      } catch (error) {
        mostrarAlerta(mensajeDeError(error, mensaje));
        return undefined;
      } finally {
        setEnCurso((n) => n - 1);
      }
    },
    [mostrarAlerta, mensajeDeError]
  );

  return { procesando: enCurso > 0, ejecutar, mensajeDeError, intlRef };
};

export type Cargando = ReturnType<typeof useCargando>;
