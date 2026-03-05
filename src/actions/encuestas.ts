import { GeneralHttpResponse } from "../types/genericTypes";
import axios from "axios";
import env from "react-dotenv";

export const getEncuestasDisponiblesHttp = async () => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getEncuestasDisponibles"}`);
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const createPreguntaEncuestaHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}${"/createPreguntaEncuesta"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getPreguntasPorTipoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.get(
      `${env.API_URL}${"/getPreguntasPorTipo"}`,
      {
        params: data,
      }
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const editarPreguntaEncuestaHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/editarPreguntaEncuesta"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const desactivarPreguntaEncuestaHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/desactivarPreguntaEncuesta"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const activarPreguntaEncuestaHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.put(
      `${env.API_URL}${"/activarPreguntaEncuesta"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const enviarEncuestaUsuarioHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${env.API_URL}${"/enviarEncuestaUsuario"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getRespuestasEncuestaPorCanjeHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}${"/getRespuestasEncuestaPorCanje"}`,
      {
        params: data,
      }
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getEncuestaPorTipoHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}${"/getEncuestaPorTipo"}`,
      {
        params: data,
      }
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const addRespuestasEncuestaUsuarioHttp = async (data: any) => {
  try {
    const response: GeneralHttpResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}${"/addRespuestasEncuestaUsuario"}`,
      data
    );
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
export const getRespuestasPorEncuestaHttp = async (data: any) => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getRespuestasPorEncuesta"}`, {
      params: data,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};

export const getRespuestasPorCanjeHttp = async (data: any) => {
  try {
    const response = await axios.get(`${env.API_URL}${"/getRespuestasPorCanje"}`, {
      params: data,
    });
    return response?.data || [];
  } catch (error) {
    const promise = new Promise((_, reject) => reject(error));
    return promise;
  }
};
