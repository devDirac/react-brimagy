import axios from "axios";
import env from "react-dotenv";
export const SET_PLATAFORMA = "SET_PLATAFORMA";

export const setPlataforma = (value: string) => ({
  type: SET_PLATAFORMA,
  value,
});

export const crearVariablesGlobalesHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/crearVariablesGlobales`, data);
  return response?.data || [];
};

export const crearPlataformaHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/crearPlataforma`, data);
  return response?.data || [];
};

export const sincronizarVariablesEnProductosHttp = async (data?: any) => {
  const response = await axios.put(`${env.API_URL}/sincronizarVariablesEnProductos`, data);
  return response?.data || [];
};

export const getVariablesGlobalesHttp = async () => {
  const response = await axios.get(`${env.API_URL}/getVariablesGlobales`);
  return response?.data || [];
};

export const getPlataformasHttp = async () => {
  const response = await axios.get(`${env.API_URL}/getPlataformas`);
  return response?.data || [];
};

export const getProductosSincronizadosHttp = async (data?: any) => {
  const response = await axios.get(`${env.API_URL}/getProductosSincronizados`, {
    params: data,
  });
  return response?.data || [];
};

export const getVariablesGlobalesPorPlataformaHttp = async (data?: any) => {
  const response = await axios.get(`${env.API_URL}/getVariablesGlobalesPorPlataforma`, {
    params: data,
  });
  return response?.data || [];
};

export const crearPeriodoHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/crearPeriodo`, data);
  return response?.data || [];
};

export const editarPeriodoHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/editarPeriodo`, data);
  return response?.data || [];
};

export const getPeriodosHttp = async (plataforma: string) => {
  const response = await axios.get(`${env.API_URL}/getPeriodos`, {
    params: { plataforma },
  });
  return response?.data || [];
};
