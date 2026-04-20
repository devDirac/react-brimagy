import { GeneralHttpResponse } from "../types/genericTypes";
import axios, { AxiosResponse } from "axios";
import env from "react-dotenv";

export const crearProductoHttp = async (data: FormData) => {
  try {
    const response: AxiosResponse = await axios.post(`${env.API_URL}/crearProducto`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const registrarNuevoPrecioHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/registrarNuevoPrecio"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getCatalogoProductosHttp = async (
  tipo_producto?: string,
  search?: string,
  fecha1?: Date,
  fecha2?: Date
) => {
  try {
    const url = new URL(`${env.API_URL}/getCatalogoProductos`);

    if (tipo_producto) url.searchParams.append("tipo_producto", tipo_producto);
    if (search) url.searchParams.append("search", search);
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

    if (search) url.searchParams.append("search", search);
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

    if (search) url.searchParams.append("search", search);
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

export const verificarIdProductoBrimagyHttp = async (ids?: string[]) => {
  try {
    const response = await axios.get(`${env.API_URL}/verificarIdProductoBrimagy`, {
      params: {
        ids: ids,
      },
    });
    return response?.data || [];
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

export const editarProductoHttp = async (data: FormData) => {
  try {
    const response: AxiosResponse = await axios.post(`${env.API_URL}/editarProducto`, data);
    return response.data;
  } catch (error) {
    throw error;
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

export const getCatalogoProductosDigitalesBrimagyHttp = async (
  search?: string,
  fecha1?: Date,
  fecha2?: Date
) => {
  try {
    const url = new URL(`${env.API_URL}/getCatalogoProductosDigitalesBrimagy`);

    if (search) url.searchParams.append("search", search);
    if (fecha1) url.searchParams.append("fecha1", fecha1.toISOString());
    if (fecha2) url.searchParams.append("fecha2", fecha2.toISOString());

    const response = await axios.get(url.toString());
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
//colores
export const crearEditarColorProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/crearEditarColorProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getProductoColorPorIdHttp = async (datos?: any) => {
  try {
    const response = await axios.get(`${env.API_URL}/getProductoColorPorId`, {
      params: datos,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const desactivarColorProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/desactivarColorProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const activarColorProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/activarColorProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
//tallas
export const crearEditarTallaProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/crearEditarTallaProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getProductoTallaPorIdHttp = async (datos?: any) => {
  try {
    const response = await axios.get(`${env.API_URL}/getProductoTallaPorId`, {
      params: datos,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const desactivarTallaProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/desactivarTallaProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const activarTallaProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/activarTallaProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
//fotos del producto
export const subirFotosProductoHttp = async (data: FormData) => {
  try {
    const response: AxiosResponse = await axios.post(`${env.API_URL}/subirFotosProducto`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getProductoFotoPorIdHttp = async (datos?: any) => {
  try {
    const response = await axios.get(`${env.API_URL}/getProductoFotoPorId`, {
      params: datos,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const desactivarFotosProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/desactivarFotosProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const activarFotosProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/activarFotosProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
//fotos promo del producto
export const subirFotosPromoProductoHttp = async (data: FormData) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${env.API_URL}/subirFotosPromoProducto`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getProductoFotoPromoPorIdHttp = async (datos?: any) => {
  try {
    const response = await axios.get(`${env.API_URL}/getProductoFotoPromoPorId`, {
      params: datos,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const desactivarFotosPromoProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/desactivarFotosPromoProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const activarFotosPromoProductoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/activarFotosPromoProducto"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
