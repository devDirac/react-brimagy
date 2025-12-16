import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

export const saveUserHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(`${env.API_URL}${"/register"}`, data);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getUsuariosHttp = async () => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getUsuarios"}`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const editUserHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(`${env.API_URL}${"/editUser"}`, data);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const activarUsuarioHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(`${env.API_URL}/activarUsuario`, {
      id: data?.id,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const desactivarUsuarioHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(`${env.API_URL}/desactivarUsuario`, {
      id: data?.id,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getCheckEmailHttp = async (email: string) => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getCheckEmail"}?email=${email}`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getCheckUsuarioHttp = async (usuario: string) => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getCheckUsuario"}?usuario=${usuario}`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const editarUsuarioHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(`${env.API_URL}/editarUsuario`, data);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
