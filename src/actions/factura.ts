import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

export const addFechaPagoFacturaHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/addFechaPagoFactura"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
