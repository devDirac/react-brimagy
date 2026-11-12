import moment from "moment";

export const moneda = (n: number | null): string =>
    n === null ? "—" : n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export const fecha = (valor: string): string =>
    valor ? moment(valor).format("DD-MM-YYYY") : "—";

export const rangoFechas = (inicio: string, fin: string): string =>
    `${fecha(inicio)} al ${fecha(fin)}`;

export const textoOVacio = (valor: string): string => valor || "N/A";