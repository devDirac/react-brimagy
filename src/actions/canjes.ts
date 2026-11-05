import axios from "axios";
import env from "react-dotenv";
import { Dispatch } from "redux";
import { GeneralHttpResponse, ResumenCanjes } from "../types/genericTypes";

export const SET_RESUMEN_CANJES = "SET_RESUMEN_CANJES";

export const setResumenCanjes = (value: ResumenCanjes | null) => ({
  type: SET_RESUMEN_CANJES,
  value,
});

export const getCanjesHttp = async (
  tipo_producto?: string,
  search?: string,
  fecha1?: Date,
  fecha2?: Date,
  plataforma?: string
) => {
  try {
    const url = new URL(`${env.API_URL}/getCanjes`);

    if (tipo_producto) url.searchParams.append("tipo_producto", tipo_producto);
    if (search) url.searchParams.append("search", search);
    if (fecha1) url.searchParams.append("fecha1", fecha1.toISOString());
    if (fecha2) url.searchParams.append("fecha2", fecha2.toISOString());
    if (plataforma) url.searchParams.append("plataforma", plataforma);

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

export const enviarValidacionSinProveedorHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/enviarValidacionSinProveedor"}`,
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

export const getCanjeByIdHttp = async (id_canje: string, plataforma: number) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL
      }${"/getCanjeById"}?id_canje=${id_canje}&plataforma=${plataforma}`
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

export const getCodigoVerificacionByIdHttp = async (id_canje: string, plataforma: number) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL
      }${"/getCodigoVerificacionById"}?id_canje=${id_canje}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const validarIdentidadPorCodigoHttp = async (
  codigo: number,
  id_canje: number
) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL
      }${"/validarIdentidadPorCodigo"}?id_canje=${id_canje}&codigo=${codigo}`
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getCanjesPorProveedorHttp = async (id_proveedor?: number, plataforma?: string) => {
  try {
    const url = new URL(`${env.API_URL}/getCanjesPorProveedor`);

    if (id_proveedor) url.searchParams.append("id_proveedor", id_proveedor.toString());
    if (plataforma) url.searchParams.append("plataforma", plataforma);

    const response = await axios.get(url.toString());
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getResumenCanjesHttp = async (
  plataforma?: string,
  tipo_producto?: string
): Promise<{ success: boolean; data: ResumenCanjes | null }> => {
  try {
    const url = new URL(`${env.API_URL}/getResumenCanjes`);

    if (plataforma) url.searchParams.append("plataforma", plataforma);
    if (tipo_producto) url.searchParams.append("tipo_producto", tipo_producto);

    const response = await axios.get(url.toString());
    const body = response?.data;

    const data: ResumenCanjes | null =
      typeof body?.total === "number" ? body : body?.data ?? null;

    return { success: typeof data?.total === "number", data };
  } catch (error) {
    const promise = new Promise<never>((_, reject) => reject(error));
    return promise;
  }
};

// Pide el resumen al backend y lo guarda en Redux. Si falla, deja los contadores como estaban
export const actualizarResumenCanjes = async (
  dispatch: Dispatch,
  plataforma: string,
  tipoProducto?: string
) => {
  try {
    const respuesta: any = await getResumenCanjesHttp(plataforma, tipoProducto);
    if (respuesta?.success && respuesta?.data) {
      dispatch(setResumenCanjes(respuesta.data));
    }
  } catch (error) {
    console.error("Error al obtener el resumen de canjes", error);
  }
};