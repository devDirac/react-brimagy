import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

/*export const getEstadisticasHomeHttp = async () => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getEstadisticasHome"}`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};*/
export const getEstadisticasHomeHttp = async (data?: any) => {
  try {
    const response: GeneralHttpResponse = await axios.get(
      `${env.API_URL}${"/getEstadisticasHome"}`,
      {
        params: data,
      }
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getEstadisticasCanjeadosHttp = async (params?: {
  fecha_inicio?: string;
  fecha_fin?: string;
  plataforma?: string;
}) => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getEstadisticasCanjeados"}`, {
      params,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getEstadisticasPuntosCategoriaHttp = async (params?: {
  fecha_inicio?: string;
  fecha_fin?: string;
  plataforma?: string;
}) => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getEstadisticasPuntosCategoria"}`, {
      params,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getEstadisticasPuntosPorTipoProductoHttp = async (params?: {
  agrupacion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  plataforma?: string;
}) => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getEstadisticasPuntosPorTipoProducto"}`, {
      params,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getEstadisticasComparativaHttp = async (params?: {
  periodo1_inicio?: string;
  periodo1_fin?: string;
  periodo2_inicio?: string;
  periodo2_fin?: string;
  plataforma?: string;
}) => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getEstadisticasComparativa"}`, {
      params,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
