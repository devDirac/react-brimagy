import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

export const crearProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/crearProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getCatalogoProductosHttp = async (search?: string, fecha1?: Date, fecha2?: Date) => {
  try {
    const url = new URL(`${env.API_URL}/getCatalogoProductos`);

    if (search) url.searchParams.append("search", encodeURIComponent(search));
    if (fecha1) url.searchParams.append("fecha1", fecha1.toISOString());
    if (fecha2) url.searchParams.append("fecha2", fecha2.toISOString());

    const response = await axios.get(url.toString());
    return response?.data || [];
  } catch (error) {
    return Promise.reject(error);
  }
};
export const getCatalogoProductosFisicosHttp = async (
  search?: string,
  fecha1?: Date,
  fecha2?: Date
) => {
  try {
    const url = new URL(`${env.API_URL}/getCatalogoProductosFisicos`);

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
export const getCatalogoProductosDigitalesHttp = async (
  search?: string,
  fecha1?: Date,
  fecha2?: Date
) => {
  try {
    const url = new URL(`${env.API_URL}/getCatalogoProductosDigitales`);

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

export const getBusquedaInteligenteHttp = async (datos?: any) => {
  try {
    const response = await axios.get(`${env.API_URL}/busquedaInteligenteBrimagy`, {
      params: {
        puntos: datos.puntos,
        categoria: datos.categoria,
      },
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getBitacoraProductoPorIdHttp = async (datos?: any) => {
  try {
    const response = await axios.get(`${env.API_URL}/getBitacoraProductoPorId`, {
      params: datos,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const verificarSkusHttp = async (skus: string[]) => {
  try {
    const response = await axios.post(`${env.API_URL}/verificarSkus`, { skus });
    return response?.data || { skus_existentes: [] };
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const verificarSkuDisponibleHttp = async (sku: string) => {
  try {
    const response = await axios.post(`${env.API_URL}/verificarSkuDisponible`, { sku });
    return response?.data || { disponible: true };
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const editarProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(`${env.API_URL}/editarProducto`, data);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const eliminarProductoHttp = async (id: number) => {
  try {
    const response: GeneralHttpResponse = await axios.delete(
      `${env.API_URL}${"/eliminarProducto"}?id_producto=${id}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
