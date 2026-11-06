import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import moment from "moment";

export interface RegistroBitacora {
  nombre_usuario: string | null;
  correo_usuario: string | null;
  evento: string | null;
  descripcion: string | null;
  fecha_edicion: string | null;
}

const col = createColumnHelper<RegistroBitacora>();

export const columnasBitacora: ColumnDef<RegistroBitacora, any>[] = [
  col.accessor("nombre_usuario", { header: "Usuario", size: 160 }),
  col.accessor("correo_usuario", { header: "Correo", size: 200 }),
  col.accessor("descripcion", {
    header: "Descripción",
    size: 420,
    cell: (info) => <span style={{ whiteSpace: "normal" }}>{info.getValue()}</span>,
  }),
  col.accessor("fecha_edicion", {
    header: "Fecha",
    size: 150,
    cell: (info) => (info.getValue() ? moment(info.getValue()).format("DD/MM/YYYY HH:mm") : ""),
  }),
];
