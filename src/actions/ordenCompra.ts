import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

export const getProveedoresOCHttp = async (search?: string) => {
  try {
    let url = `${env.API_URL}/getProveedoresOC`;

    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }

    const response = await axios.get(url);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const enviarCotizacionProveedorHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/enviarCotizacionProveedor"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getOrdenCompraPorProveedorHttp = async (id_ordencompra: string) => {
  try {
    const response = await axios.get(
      `${
        process.env.REACT_APP_API_URL
      }${"/getOrdenCompraPorProveedor"}?id_ordencompra=${id_ordencompra}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const aceptarProductoOCHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}${"/aceptarProductoOC"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const rechazarProductoOCHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}${"/rechazarProductoOC"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
