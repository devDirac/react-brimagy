import axios from "axios";
import env from "react-dotenv";

export const subirEvidenciasHttp = async (data: FormData) => {
  const response = await axios.post(`${env.API_URL}/subirEvidencias`, data);
  return response.data;
};
