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
export const getCatalogoProductosHttp = async (search?: string) => {
  try {
    let url = `${env.API_URL}/getCatalogoProductos`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await axios.get(url);
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
