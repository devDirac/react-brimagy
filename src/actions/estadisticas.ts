import axios from "axios";
import env from "react-dotenv";

export const getEstadisticasHomeHttp = async (data?: any) => {
  const response = await axios.get(`${env.API_URL}/getEstadisticasHome`, {
    params: data,
  });
  return response?.data || [];
};

export const getEstadisticasCanjeadosHttp = async (params?: {
  fecha_inicio?: string;
  fecha_fin?: string;
  plataforma?: string;
}) => {
  const response = await axios.get(`${env.API_URL}/getEstadisticasCanjeados`, {
    params,
  });
  return response?.data || [];
};
export const getEstadisticasPuntosCategoriaHttp = async (params?: {
  fecha_inicio?: string;
  fecha_fin?: string;
  plataforma?: string;
}) => {
  const response = await axios.get(`${env.API_URL}/getEstadisticasPuntosCategoria`, {
    params,
  });
  return response?.data || [];
};
export const getEstadisticasPuntosPorTipoProductoHttp = async (params?: {
  agrupacion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  plataforma?: string;
}) => {
  const response = await axios.get(`${env.API_URL}/getEstadisticasPuntosPorTipoProducto`, {
    params,
  });
  return response?.data || [];
};
export const getEstadisticasComparativaHttp = async (params?: {
  periodo1_inicio?: string;
  periodo1_fin?: string;
  periodo2_inicio?: string;
  periodo2_fin?: string;
  plataforma?: string;
}) => {
  const response = await axios.get(`${env.API_URL}/getEstadisticasComparativa`, {
    params,
  });
  return response?.data || [];
};
export const getReporteGeneralCanjesHttp = async (params?: {
  fecha_inicio?: string;
  fecha_fin?: string;
  plataforma?: string;
}) => {
  const response = await axios.get(`${env.API_URL}/getReporteGeneralCanjes`, {
    params,
  });
  return response?.data || [];
};

export const getReporteGlobalExcelHttp = async (params?: {
  fecha_inicio?: string;
  fecha_fin?: string;
  plataforma?: string;
}) => {
  const response = await axios.get(`${env.API_URL}/exportarExcel`, {
    params,
    responseType: "blob",
  });
  return response;
};
