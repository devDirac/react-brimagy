import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

export const getCanjesHttp = async (search?: string, fecha1?: Date, fecha2?: Date) => {
  try {
    const url = new URL(`${env.API_URL}/getCanjes`);

    if (search) url.searchParams.append("search", encodeURIComponent(search));
    if (fecha1) url.searchParams.append("fecha1", fecha1.toISOString());
    if (fecha2) url.searchParams.append("fecha2", fecha2.toISOString());

    const response = await axios.get(url.toString());
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const enviarValidacionHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/enviarValidacion"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const validarCodigoCanjeHttp = async (codigo: number, id_canje: number) => {
  try {
    const response: GeneralHttpResponse = await axios.post(`${env.API_URL}/validarCodigoCanje`, {
      codigo,
      id_canje,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getCanjeByIdHttp = async (id_canje: string) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}${"/getCanjeById"}?id_canje=${id_canje}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const solicitarCodigoValidacionHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}${"/solicitarCodigoValidacion"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getCodigoVerificacionByIdHttp = async (id_canje: string) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}${"/getCodigoVerificacionById"}?id_canje=${id_canje}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const validarIdentidadPorCodigoHttp = async (codigo: number, id_canje: number) => {
  try {
    const response = await axios.post(
      `${
        process.env.REACT_APP_API_URL
      }${"/validarIdentidadPorCodigo"}?id_canje=${id_canje}&codigo=${codigo}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getCanjesPorProveedorHttp = async (id_proveedor: number) => {
  try {
    const response = await axios.get(
      `${env.API_URL}${"/getCanjesPorProveedor"}?id_proveedor=${id_proveedor}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
