import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

export const crearProveedorHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/crearProveedor"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getProveedoresHttp = async () => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getProveedores"}`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const editarProveedorHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(`${env.API_URL}/editarProveedor`, data);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const eliminarProveedorHttp = async (id: number) => {
  try {
    const response: GeneralHttpResponse = await axios.delete(
      `${env.API_URL}${"/eliminarProveedor"}?id=${id}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getProductoNuevoProveedorHttp = async (data: any) => {
  try {
    const response = await axios.get(`${env.API_URL}/getProductoNuevoProveedor`, {
      params: data,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const enviarANuevoProveedorHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}/enviarANuevoProveedor`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
