import axios from "axios";
import env from "react-dotenv";

export const addFechaPagoFacturaHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/addFechaPagoFactura`, data);
  return response?.data || [];
};
