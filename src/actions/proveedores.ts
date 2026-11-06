import axios from "axios";
import env from "react-dotenv";

export const crearProveedorHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/crearProveedor`, data);
  return response?.data || [];
};
export const asignarProveedorHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/asignarProveedor`, data);
  return response?.data || [];
};
export const getProveedoresHttp = async () => {
  const response = await axios.get(`${env.API_URL}/getProveedores`);
  return response?.data || [];
};

export const editarProveedorHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/editarProveedor`, data);
  return response?.data || [];
};

export const eliminarProveedorHttp = async (id: number) => {
  const response = await axios.delete(`${env.API_URL}/eliminarProveedor?id=${id}`);
  return response?.data || [];
};
export const getProductoNuevoProveedorHttp = async (data: any) => {
  const response = await axios.get(`${env.API_URL}/getProductoNuevoProveedor`, {
    params: data,
  });
  return response?.data || [];
};
export const enviarANuevoProveedorHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/enviarANuevoProveedor`, data);
  return response?.data || [];
};
