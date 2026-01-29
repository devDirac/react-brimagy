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
export const getOCPorIdProveedorHttp = async (id_proveedor: number) => {
  try {
    const response = await axios.get(
      `${env.API_URL}${"/getOCPorIdProveedor"}?id_proveedor=${id_proveedor}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getOCPorIdHttp = async (id_orden_compra: number) => {
  try {
    const response = await axios.get(
      `${env.API_URL}${"/getOCPorId"}?id_orden_compra=${id_orden_compra}`
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
export const enviarOCAprobacionHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${process.env.REACT_APP_API_URL}${"/enviarOCAprobacion"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const enviarOrdenCompraFileProveedorHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/enviarOrdenCompraFileProveedor"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const validarFacturaOrdenCompraHttp = async (formData: FormData) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/validarFacturaOrdenCompra`,
      formData
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const subirPDFFacturaHttp = async (formData: FormData) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/subirPDFFactura`,
      formData
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const validarOrdenCompraFinalHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${process.env.REACT_APP_API_URL}${"/validarOrdenCompraFinal"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const rechazarCotizacionDeProveedorHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/rechazarCotizacionDeProveedor"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
