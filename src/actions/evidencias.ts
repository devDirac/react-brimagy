import { GeneralHttpResponse } from "../types/genericTypes";
import axios, { AxiosResponse } from "axios";
import env from "react-dotenv";

export const subirEvidenciasHttp = async (data: FormData) => {
  try {
    const response: AxiosResponse = await axios.post(`${env.API_URL}/subirEvidencias`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
