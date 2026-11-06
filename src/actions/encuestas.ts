import axios from "axios";
import env from "react-dotenv";

export const getEncuestasDisponiblesHttp = async (plataforma?: string) => {
  const url = new URL(`${env.API_URL}/getEncuestasDisponibles`);

  if (plataforma) url.searchParams.append("plataforma", plataforma);

  const response = await axios.get(url.toString());
  return response?.data || [];
};
export const createPreguntaEncuestaHttp = async (data: any) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/createPreguntaEncuesta`,
    data
  );
  return response?.data || [];
};
export const getPreguntasPorTipoHttp = async (data: any) => {
  const response = await axios.get(`${env.API_URL}/getPreguntasPorTipo`, {
    params: data,
  });
  return response?.data || [];
};
export const editarPreguntaEncuestaHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/editarPreguntaEncuesta`, data);
  return response?.data || [];
};
export const desactivarPreguntaEncuestaHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/desactivarPreguntaEncuesta`, data);
  return response?.data || [];
};
export const activarPreguntaEncuestaHttp = async (data: any) => {
  const response = await axios.put(`${env.API_URL}/activarPreguntaEncuesta`, data);
  return response?.data || [];
};
export const enviarEncuestaUsuarioHttp = async (data: any) => {
  const response = await axios.post(`${env.API_URL}/enviarEncuestaUsuario`, data);
  return response?.data || [];
};
export const getRespuestasEncuestaPorCanjeHttp = async (data: any) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/getRespuestasEncuestaPorCanje`,
    {
      params: data,
    }
  );
  return response?.data || [];
};
export const getEncuestaPorTipoHttp = async (data: any) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/getEncuestaPorTipo`, {
    params: data,
  });
  return response?.data || [];
};

export const addRespuestasEncuestaUsuarioHttp = async (data: any) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/addRespuestasEncuestaUsuario`,
    data
  );
  return response?.data || [];
};
export const getRespuestasPorEncuestaHttp = async (data: any) => {
  const response = await axios.get(`${env.API_URL}/getRespuestasPorEncuesta`, {
    params: data,
  });
  return response?.data || [];
};

export const getRespuestasPorCanjeHttp = async (data: any) => {
  const response = await axios.get(`${env.API_URL}/getRespuestasPorCanje`, {
    params: data,
  });
  return response?.data || [];
};
