import axios from "axios";
import env from "react-dotenv";

export const getProveedoresOCHttp = async (search?: string, plataforma?: string) => {
  const url = new URL(`${env.API_URL}/getProveedoresOC`);

  if (search) url.searchParams.append("search", search);
  if (plataforma) url.searchParams.append("plataforma", plataforma);

  const response = await axios.get(url.toString());
  return response?.data || [];
};
export const enviarCotizacionProveedorHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/enviarCotizacionProveedor`, data);
  return response?.data || [];
};
export const getOCPorIdProveedorHttp = async (id_proveedor?: number, plataforma?: string) => {
  const url = new URL(`${env.API_URL}/getOCPorIdProveedor`);

  if (id_proveedor) url.searchParams.append("id_proveedor", id_proveedor.toString());
  if (plataforma) url.searchParams.append("plataforma", plataforma);

  const response = await axios.get(url.toString());
  return response?.data || [];
};
export const getOCPorIdHttp = async (id_orden_compra: number) => {
  const response = await axios.get(`${env.API_URL}/getOCPorId?id_orden_compra=${id_orden_compra}`);
  return response?.data || [];
};
export const getOrdenCompraPorProveedorHttp = async (id_ordencompra: string) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/getOrdenCompraPorProveedor?id_ordencompra=${id_ordencompra}`
  );
  return response?.data || [];
};
export const aceptarProductoOCHttp = async (data: any) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/aceptarProductoOC`, data);
  return response?.data || [];
};
export const rechazarProductoOCHttp = async (data: any) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/rechazarProductoOC`, data);
  return response?.data || [];
};
export const enviarOCAprobacionHttp = async (data: any) => {
  const response = await axios.put(`${process.env.REACT_APP_API_URL}/enviarOCAprobacion`, data);
  return response?.data || [];
};
export const enviarOrdenCompraFileProveedorHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/enviarOrdenCompraFileProveedor`, data);
  return response?.data || [];
};
export const validarFacturaOrdenCompraHttp = async (formData: FormData) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/validarFacturaOrdenCompra`,
    formData
  );
  return response?.data || [];
};
export const subirPDFFacturaHttp = async (formData: FormData) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/subirPDFFactura`, formData);
  return response?.data || [];
};
export const validarOrdenCompraFinalHttp = async (data: any) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/validarOrdenCompraFinal`,
    data
  );
  return response?.data || [];
};
export const rechazarCotizacionDeProveedorHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/rechazarCotizacionDeProveedor`, data);
  return response?.data || [];
};
export const cotizarConOtrosProveedoresHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/cotizarConOtrosProveedores`, data);
  return response?.data || [];
};

export const getConfigCotizacionHttp = async () => {
  const response = await axios.get(`${env.API_URL}/getConfigCotizacion`);
  return response?.data || {};
};
