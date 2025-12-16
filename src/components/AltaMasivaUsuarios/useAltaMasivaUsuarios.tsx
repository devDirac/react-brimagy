import { useRef } from "react";
import type { AltaMasivaUsuariosProps } from "./types";
import readXlsxFile from "read-excel-file";
import { useMaterialUIController } from "context";
import _ from "lodash";

const useAltaMasivaUsuarios = (props: AltaMasivaUsuariosProps) => {
  const reference = useRef(null);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const columns = [
    "nombre",
    "correo",
    "password",
    "direccion",
    "rfc",
    "telefono",
    "permisos",
    "agente_id",
  ];

  const handleArchivo = async (evt: any) => {
    try {
      const file = evt.target.files[0];
      readXlsxFile(file)
        .then(async (rows: any) => {
          if (_.isEqual(rows[0], columns)) {
            rows.shift();
            props?.onSelect(rows);
          } else {
            props?.onErrorDocumento();
          }
        })
        .catch(() => {
          props?.onErrorDocumento();
        });
    } catch (error) {}
  };
  return {
    darkMode,
    handleArchivo,
    reference,
  };
};

export default useAltaMasivaUsuarios;
