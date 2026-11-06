import axios from "axios";
import env from "react-dotenv";

export const crearCategoriaHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/crearCategoria`, data);
  return response?.data || [];
};
export const getCategoriasHttp = async (plataforma?: string) => {
  const url = new URL(`${env.API_URL}/getCategorias`);

  if (plataforma) url.searchParams.append("plataforma", plataforma);

  const response = await axios.get(url.toString());
  return response?.data || [];
};
export const getCategoriasPrincipalHttp = async (plataforma?: string) => {
  const url = new URL(`${env.API_URL}/getCategoriasPrincipal`);

  if (plataforma) url.searchParams.append("plataforma", plataforma);

  const response = await axios.get(url.toString());
  return response?.data || [];
};

export const editarCategoriaHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/editarCategoria`, data);
  return response?.data || [];
};

export const eliminarCategoriaHttp = async (id: number) => {
  const response = await axios.put(`${env.API_URL}/eliminarCategoria?id=${id}`);
  return response?.data || [];
};

export const reactivarCategoriaHttp = async (id: number) => {
  const response = await axios.put(`${env.API_URL}/reactivarCategoria?id=${id}`);
  return response?.data || [];
};
