import axios from "axios";
import env from "react-dotenv";

export const saveUserHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/register`, data);
  return response?.data || [];
};
export const getUsuariosHttp = async (plataforma?: string) => {
  const url = new URL(`${env.API_URL}/getUsuarios`);

  if (plataforma) url.searchParams.append("plataforma", plataforma);

  const response = await axios.get(url.toString());
  return response?.data || [];
};
export const getUsuariosPlataformaHttp = async () => {
  const response = await axios.get(`${env.API_URL}/getUsuariosPlataforma`);
  return response?.data || [];
};
export const getTipoUsuariosHttp = async () => {
  const response = await axios.get(`${env.API_URL}/getTipoUsuarios`);
  return response?.data || [];
};
export const editUserHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/editUser`, data);
  return response?.data || [];
};

export const activarUsuarioHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/activarUsuario`, data);
  return response?.data || [];
};
export const desactivarUsuarioHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/desactivarUsuario`, data);
  return response?.data || [];
};

export const getCheckEmailHttp = async (email: string) => {
  const response = await axios.get(`${env.API_URL}/getCheckEmail?email=${email}`);
  return response?.data || [];
};

export const getCheckEmailUsuarioPlataformaHttp = async (email: string) => {
  const response = await axios.get(`${env.API_URL}/getCheckEmailUsuarioPlataforma?email=${email}`);
  return response?.data || [];
};

export const getCheckUsuarioHttp = async (usuario: string) => {
  const response = await axios.get(`${env.API_URL}/getCheckUsuario?usuario=${usuario}`);
  return response?.data || [];
};

export const editarUsuarioHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/editarUsuario`, data);
  return response?.data || [];
};

export const crearUsuarioPlataformaHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/crearUsuarioPlataforma`, data);
  return response?.data || [];
};
export const getTiposUsuarioHttp = async (plataforma?: string) => {
  const url = new URL(`${env.API_URL}/getCatalogoTipoUsuarios`);

  if (plataforma) url.searchParams.append("plataforma", plataforma);

  const response = await axios.get(url.toString());
  return response?.data || [];
};
