import axios from "axios";
import env from "react-dotenv";

export const getProductosAlmacenHttp = async (search?: string, plataforma?: string) => {
  const url = new URL(`${env.API_URL}/getProductosAlmacen`);

  if (search) url.searchParams.append("search", search);
  if (plataforma) url.searchParams.append("plataforma", plataforma);

  const response = await axios.get(url.toString());
  return response?.data || [];
};

export const getProductoAlmacenPorIdHttp = async (data: any) => {
  const response = await axios.get(`${env.API_URL}/getProductoAlmacenPorId`, {
    params: data,
  });
  return response?.data || [];
};
export const recibirProductoAlmacenHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/recibirProductoAlmacen`, data);
  return response?.data || [];
};
export const addGuiaProductoAlmacenHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/addGuiaProductoAlmacen`, data);
  return response?.data || [];
};
export const enviarProductoAlmacenHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/enviarProductoAlmacen`, data);
  return response?.data || [];
};
export const confirmarRecepcionProductoAlmacenHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/confirmarRecepcionProductoAlmacen`, data);
  return response?.data || [];
};
export const registrarNuevoPrecioAlmacenHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/registrarNuevoPrecioAlmacen`, data);
  return response?.data || [];
};
export const registrarMeiNoSerieHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/registrarMeiNoSerie`, data);
  return response?.data || [];
};

//RESUMEN DE ALMACÉN
export const getReporteSemanalAlmacenHttp = async (
  plataforma: string,
  idPeriodo?: number | null
) => {
  const response = await axios.get(`${env.API_URL}/getReporteSemanalAlmacen`, {
    params: { plataforma, ...(idPeriodo ? { id_periodo: idPeriodo } : {}) },
  });
  return response?.data || null;
};