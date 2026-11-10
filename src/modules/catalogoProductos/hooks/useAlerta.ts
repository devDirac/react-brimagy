import { useCallback, useState } from "react";

/** Modal de mensajes del catálogo. */
export const useAlerta = () => {
  const [abierta, setAbierta] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const mostrar = useCallback((texto: string) => {
    setMensaje(texto);
    setAbierta(true);
  }, []);

  const cerrar = useCallback(() => setAbierta(false), []);

  return { abierta, mensaje, mostrar, cerrar };
};

export type Alerta = ReturnType<typeof useAlerta>;
